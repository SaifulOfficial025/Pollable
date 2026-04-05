import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../Shared/Button";
import { API_BASE_URL } from "../../Redux/Config";
import { fetchVotePeople } from "../../Redux/Polls/VoterList";
import { fetchReactionPeople } from "../../Redux/Polls/ReactionPeopleList";
import { followUser, unfollowUser } from "../../Redux/ProfileFollowUnfollow";

const ANONYMOUS_AVATARS = [
  "/anonymous_boys (1).jpg",
  "/anonymous_boys (2).jpg",
  "/anonymous_boys (3).jpg",
  "/anonymous_boys (4).jpg",
  "/anonymous_boys (5).jpg",
  "/anonymous_boys (6).jpg",
  "/anonymous_boys (7).jpg",
  "/anonymous_girl (1).jpg",
  "/anonymous_girl (2).jpg",
  "/anonymous_girl (3).jpg",
  "/anonymous_girl (4).jpg",
  "/anonymous_girl (5).jpg",
  "/anonymous_girl (6).jpg",
  "/anonymous_girl (7).jpg",
  "/anonymous_girl (8).jpg",
  "/anonymous_girl (9).jpg",
  "/anonymous_girl (10).jpg",
];

const hashString = (value = "") => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

function VoteUsersandReactionModal({
  initialOpen = true,
  onClose,
  title = "People",
  pollId,
  optionId,
  mode = "vote",
  pageSize = 20,
}) {
  const [open, setOpen] = useState(initialOpen);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [people, setPeople] = useState([]);
  const [busyUserId, setBusyUserId] = useState(null);

  const currentUserId = useMemo(() => {
    const cached = localStorage.getItem("profileData");
    if (!cached) return null;
    try {
      const parsed = JSON.parse(cached);
      return parsed?.id || parsed?.user_id || null;
    } catch {
      return null;
    }
  }, []);

  const toAbsolute = (url) => {
    if (!url || typeof url !== "string") return "/dummyavatar.jpg";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  const isAnonymousUser = (person) => {
    const username = String(person?.username || "")
      .trim()
      .toLowerCase();
    return username === "anonymous";
  };

  const resolveAvatar = (person, index) => {
    if (isAnonymousUser(person)) {
      const seed = `${person?.user_id || "anon"}-${person?.option_id || "opt"}-${person?.voted_at || person?.created_at || ""}-${index}`;
      const pick = hashString(seed) % ANONYMOUS_AVATARS.length;
      return ANONYMOUS_AVATARS[pick];
    }
    return toAbsolute(person?.image);
  };

  const getProfilePath = (person) => {
    const username = person?.username;
    const userId = person?.user_id;
    if (username && userId) {
      return `/user/${encodeURIComponent(username)}?user_id=${encodeURIComponent(userId)}`;
    }
    if (username) return `/user/${encodeURIComponent(username)}`;
    if (userId) return `/user/?user_id=${encodeURIComponent(userId)}`;
    return "/user/";
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  useEffect(() => {
    if (!open || !pollId) return;

    let cancelled = false;

    const loadPeople = async () => {
      setLoading(true);
      setError("");
      try {
        const result =
          mode === "reaction"
            ? await fetchReactionPeople({
                pollId,
                page: 1,
                pageSize,
              })
            : await fetchVotePeople({
                pollId,
                optionId,
                page: 1,
                pageSize,
              });
        if (!cancelled) {
          setPeople(Array.isArray(result?.people) ? result.people : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load people.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPeople();
    return () => {
      cancelled = true;
    };
  }, [open, pollId, optionId, mode, pageSize]);

  const handleToggleFollow = async (person) => {
    const userId = person?.user_id;
    if (!userId || busyUserId === userId) return;

    setBusyUserId(userId);
    const currentlyFollowing = Boolean(person?.is_following);

    setPeople((prev) =>
      prev.map((p) =>
        p.user_id === userId ? { ...p, is_following: !currentlyFollowing } : p,
      ),
    );

    try {
      if (currentlyFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch {
      setPeople((prev) =>
        prev.map((p) =>
          p.user_id === userId ? { ...p, is_following: currentlyFollowing } : p,
        ),
      );
    } finally {
      setBusyUserId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="p-4 sm:p-5 max-h-[70vh] overflow-y-auto">
          {loading && <div className="text-sm text-gray-500">Loading...</div>}

          {!loading && error && (
            <div className="text-sm text-red-500">{error}</div>
          )}

          {!loading && !error && people.length === 0 && (
            <div className="text-sm text-gray-500">No people found.</div>
          )}

          {!loading && !error && people.length > 0 && (
            <ul className="space-y-3">
              {people.map((person, idx) => {
                const isAnonymous = isAnonymousUser(person);
                const isMe =
                  currentUserId !== null &&
                  String(currentUserId) === String(person?.user_id);
                const isBusy = busyUserId === person?.user_id;
                const followLabel = person?.is_following
                  ? "Unfollow"
                  : "Follow";

                return (
                  <li
                    key={`${person?.user_id || "unknown"}-${person?.option_id || "opt"}-${person?.voted_at || person?.created_at || idx}`}
                    className="flex items-center justify-between gap-3 border border-gray-100 rounded-xl p-3"
                  >
                    {isAnonymous ? (
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={resolveAvatar(person, idx)}
                          alt={person?.name || person?.username || "User"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {person?.name || "User"}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            @{person?.username || "unknown"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={getProfilePath(person)}
                        className="flex items-center gap-3 min-w-0"
                      >
                        <img
                          src={resolveAvatar(person, idx)}
                          alt={person?.name || person?.username || "User"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {person?.name || "User"}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            @{person?.username || "unknown"}
                          </div>
                        </div>
                      </Link>
                    )}

                    {!isMe && !isAnonymous && (
                      <Button
                        size="md"
                        onClick={() => handleToggleFollow(person)}
                        disabled={isBusy}
                        className={`min-w-[90px] ${
                          person?.is_following
                            ? "bg-gray-100 text-gray-700"
                            : ""
                        }`}
                      >
                        {isBusy ? "..." : followLabel}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoteUsersandReactionModal;
