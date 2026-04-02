import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../Layout/Container/Container";
import Header from "./Header";
import PollCard from "./PollCard";
import RightBar from "./RightBar";
import Sidebar from "./Sidebar";
import { IoAddCircleOutline } from "react-icons/io5";
import PollCardWithOneImage from "./PollCardWithOneImage";
import PollCardwithMultiImage from "./PollCardwithMultiImage";
import { fetchProfile } from "../../Redux/Auth/Profile";
import { API_BASE_URL } from "../../Redux/Config";
import { createPollsSocket, normalizePoll } from "../../Redux/Polls/FetchPolls";

const Home = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("/dummyavatar.jpg");
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [socketReady, setSocketReady] = useState(false);
  const loadMoreRef = useRef(null);
  const socketRef = useRef(null);
  const limit = 10;
  const nextTriggerIndexRef = useRef(7);
  const [feedError, setFeedError] = useState("");
  const [hasReceivedData, setHasReceivedData] = useState(false);
  const [pollOfTheDay, setPollOfTheDay] = useState(null);
  const [trendingPolls, setTrendingPolls] = useState([]);
  const [savedDrafts, setSavedDrafts] = useState([]);
  const pendingFeedResetRef = useRef(false);
  const delayedResetTimerRef = useRef(null);

  const isAuthenticated = Boolean(
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken"),
  );

  useEffect(() => {
    if (isAuthenticated) return;

    let redirected = false;
    const redirectToSignIn = () => {
      if (redirected) return;
      redirected = true;
      navigate("/signin", { replace: true });
    };

    // Allow guests to preview the home feed briefly like social apps.
    const previewTimer = window.setTimeout(redirectToSignIn, 8000);
    const handleInteraction = () => {
      redirectToSignIn();
    };

    window.addEventListener("pointerdown", handleInteraction);

    return () => {
      window.clearTimeout(previewTimer);
      window.removeEventListener("pointerdown", handleInteraction);
    };
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadProfile = async () => {
      const cached = localStorage.getItem("profileData");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setProfile(parsed);
          if (parsed?.image) {
            setAvatarUrl(
              parsed.image.startsWith("http")
                ? parsed.image
                : `${API_BASE_URL}${parsed.image}`,
            );
          }
        } catch {
          // ignore parse errors
        }
      }

      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await fetchProfile();
        const data = response?.data || null;
        if (data) {
          setProfile(data);
          localStorage.setItem("profileData", JSON.stringify(data));
          if (data.image) {
            setAvatarUrl(
              data.image.startsWith("http")
                ? data.image
                : `${API_BASE_URL}${data.image}`,
            );
          }
        }
      } catch {
        // leave cached avatar if fetch fails
      }
    };

    loadProfile();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let closed = false;

    const socketInstance = createPollsSocket({
      onOpen: () => {
        setFeedError("");
        setSocketReady(true);
      },
      onMessage: (payload) => {
        setFeedError("");

        if (payload?.type === "poll_of_the_day") {
          const pod = normalizePoll(payload?.data?.poll || payload?.data);
          if (pod) {
            setPollOfTheDay(pod);
          }
          return;
        }

        const trendingIndicators = [
          payload?.action,
          payload?.type,
          payload?.event,
          payload?.data?.action,
          payload?.data?.type,
          payload?.data?.event,
        ];

        const isTrending =
          trendingIndicators.some(
            (flag) =>
              typeof flag === "string" &&
              flag.toLowerCase().includes("trending"),
          ) ||
          Array.isArray(payload?.data?.trending_polls) ||
          Array.isArray(payload?.trending_polls);

        if (isTrending) {
          const trendingCandidates = [
            payload?.data?.trending_polls,
            payload?.trending_polls,
            payload?.data?.results,
            payload?.data?.polls,
            payload?.results,
            payload?.polls,
            payload?.data,
          ];

          const rawTrending =
            trendingCandidates.find((c) => Array.isArray(c)) || [];
          const normalizedTrending = rawTrending
            .map((p) => normalizePoll(p))
            .filter(Boolean);
          setTrendingPolls(normalizedTrending);
          return;
        }

        const draftsIndicators = [
          payload?.action,
          payload?.type,
          payload?.event,
          payload?.data?.action,
          payload?.data?.type,
          payload?.data?.event,
        ];

        const isDrafts =
          draftsIndicators.some(
            (flag) =>
              typeof flag === "string" && flag.toLowerCase().includes("draft"),
          ) ||
          Array.isArray(payload?.data?.drafts) ||
          Array.isArray(payload?.drafts);

        if (isDrafts) {
          const draftCandidates = [
            payload?.data?.drafts,
            payload?.drafts,
            payload?.data?.results,
            payload?.data?.polls,
            payload?.results,
            payload?.polls,
            payload?.data,
          ];

          const rawDrafts = draftCandidates.find((c) => Array.isArray(c)) || [];
          const normalizedDrafts = rawDrafts
            .map((p) => normalizePoll(p))
            .filter(Boolean);
          setSavedDrafts(normalizedDrafts);
          if (normalizedDrafts.length) {
            localStorage.setItem(
              "lastDraftPoll",
              JSON.stringify(normalizedDrafts[0]),
            );
          } else {
            localStorage.removeItem("lastDraftPoll");
          }
          return;
        }

        const candidates = [
          payload?.data?.results,
          payload?.data?.polls,
          payload?.data?.data?.results,
          payload?.results,
          payload?.polls,
          payload?.data,
        ];
        const rawList = candidates.find((c) => Array.isArray(c)) || [];

        const hasMoreFlag =
          payload?.data?.has_more ??
          payload?.has_more ??
          (Array.isArray(rawList) && rawList.length === limit);

        if (!rawList.length) {
          // Treat as end of feed but keep previous items visible
          setHasMore(Boolean(hasMoreFlag));
          setHasReceivedData(true);
          setIsLoading(false);
          return;
        }

        const normalized = rawList.map((p) => normalizePoll(p)).filter(Boolean);

        setPolls((prev) => {
          const merged = [...prev, ...normalized];
          // Update next trigger index for prefetch (8th item after the latest batch)
          nextTriggerIndexRef.current =
            prev.length + Math.min(7, normalized.length - 1);
          return merged;
        });

        // If fewer than limit, assume no more pages
        setHasReceivedData(true);
        setHasMore(Boolean(hasMoreFlag));
        setIsLoading(false);
      },
      onError: () => {
        setFeedError("Unable to load polls from the server.");
        setIsLoading(false);
        setHasMore(false);
      },
      onClose: () => {
        if (!closed) setSocketReady(false);
      },
    });

    socketRef.current = socketInstance;

    return () => {
      closed = true;
      socketInstance?.close?.();
    };
  }, [isAuthenticated]);

  // initial fetch
  useEffect(() => {
    if (!socketReady || !socketRef.current) return;
    setIsLoading(true);
    socketRef.current.sendGetFeed({ limit, offset: 0 });
    socketRef.current.sendGetTrending({ hours: 24, limit: 10 });
    socketRef.current.sendGetMyDrafts({ limit: 20, offset: 0 });
    setOffset(limit);
  }, [socketReady]);

  const handleSearch = (query) => {
    if (!socketReady || !socketRef.current) return;
    const trimmed = (query || "").trim();
    if (!trimmed) return;

    setIsLoading(true);
    setHasMore(true);
    setHasReceivedData(false);
    setPolls([]);
    socketRef.current.sendSearchPolls({ query: trimmed, limit: 20, offset: 0 });
  };

  const viewPollOfTheDay = () => {
    if (!pollOfTheDay) return;
    setPolls([pollOfTheDay]);
    setHasMore(false);
    setHasReceivedData(true);
    setIsLoading(false);
  };

  const viewTrendingPoll = (poll) => {
    if (!poll) return;
    setPolls([poll]);
    setHasMore(false);
    setHasReceivedData(true);
    setIsLoading(false);
  };

  const viewSavedDraft = (poll) => {
    if (!poll) return;
    setPolls([poll]);
    setHasMore(false);
    setHasReceivedData(true);
    setIsLoading(false);
  };

  const fetchNext = () => {
    if (!socketReady || !hasMore || isLoading) return;
    setIsLoading(true);
    socketRef.current?.sendGetFeed({ limit, offset });
    setOffset((o) => o + limit);
  };

  const refreshFeedNow = useCallback(() => {
    if (!socketRef.current) return;

    setPolls([]);
    setHasMore(true);
    setHasReceivedData(false);
    setIsLoading(true);
    setOffset(0);

    socketRef.current.sendGetFeed({ limit, offset: 0 });
    socketRef.current.sendGetTrending({ hours: 24, limit: 10 });
    socketRef.current.sendGetMyDrafts({ limit: 20, offset: 0 });
    setOffset(limit);
  }, [limit]);

  // Prefetch when user reaches the 8th poll of current batch
  useEffect(() => {
    if (!polls.length) return;
    const index = nextTriggerIndexRef.current;
    if (index >= polls.length) return;

    const sentinel = document.querySelector(`[data-poll-index="${index}"]`);
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchNext();
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polls]);

  // Allow external triggers (Home button/logo) to reset feed without a full reload
  useEffect(() => {
    if (!isAuthenticated) return;

    const resetFeed = () => {
      if (!socketReady || !socketRef.current) {
        pendingFeedResetRef.current = true;
        return;
      }

      refreshFeedNow();

      // Run one delayed pass to catch eventual consistency after writes.
      if (delayedResetTimerRef.current) {
        window.clearTimeout(delayedResetTimerRef.current);
      }
      delayedResetTimerRef.current = window.setTimeout(() => {
        if (socketRef.current && socketReady) {
          refreshFeedNow();
        }
      }, 1200);
    };

    window.addEventListener("resetHomeFeed", resetFeed);
    return () => {
      window.removeEventListener("resetHomeFeed", resetFeed);
      if (delayedResetTimerRef.current) {
        window.clearTimeout(delayedResetTimerRef.current);
      }
    };
  }, [isAuthenticated, socketReady, refreshFeedNow]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!socketReady || !pendingFeedResetRef.current) return;
    pendingFeedResetRef.current = false;
    refreshFeedNow();
  }, [isAuthenticated, socketReady, refreshFeedNow]);

  return (
    <div className="min-h-screen  ">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 ">
        <Header onSearch={handleSearch} />
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-16 mt-6 max-w-[1536px]">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Sticky */}
          <div className="col-span-12 lg:col-span-2">
            <div className="sticky top-24">
              <Sidebar
                savedDrafts={savedDrafts}
                onSelectSavedDraft={viewSavedDraft}
              />
            </div>
          </div>

          {/* Main content - Scrollable */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 pb-24 md:pb-16">
            {/* Collapsed composer - triggers global modal */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors sm:mt-0 md:mt-0 lg:mt-0 xl:mt-0 -mt-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <button
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("openPostPoll"))
                    }
                    className="flex-1 text-left bg-gray-50 border border-gray-200 rounded-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-500"
                  >
                    What's on your mind? Create a poll...
                  </button>
                </div>

                <button
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("openPostPoll"))
                  }
                  className="hidden sm:flex sm:mt-0 sm:ml-2 bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white px-3 py-3 rounded-lg items-center justify-center w-auto"
                >
                  <IoAddCircleOutline className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Dynamically render polls from feed */}
            {polls.map((poll, idx) => {
              const type = poll.poll_type || poll.type;
              const key = poll.id || idx;

              return (
                <div key={key} data-poll-index={idx}>
                  {type === "single_image" ? (
                    <PollCardWithOneImage pollData={poll} />
                  ) : type === "multiple_images" ? (
                    <PollCardwithMultiImage pollData={poll} />
                  ) : (
                    <PollCard pollData={poll} />
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="text-center text-sm text-gray-500">
                Loading polls...
              </div>
            )}

            {feedError && (
              <div className="text-center text-sm text-red-500">
                {feedError}
              </div>
            )}

            {!isLoading && hasReceivedData && polls.length === 0 && (
              <div className="text-center text-sm text-gray-500">
                No polls available.
              </div>
            )}
          </div>

          {/* Right bar - Sticky */}
          <div className="col-span-12 lg:col-span-3 pb-20 md:pb-0">
            <div className="sticky top-24">
              <RightBar
                pollOfTheDay={pollOfTheDay}
                onViewPollOfTheDay={viewPollOfTheDay}
                trendingPolls={trendingPolls}
                onSelectTrendingPoll={viewTrendingPoll}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
