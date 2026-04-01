import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import UserCard from "./UserCard";
import PollCard from "../Home/PollCard";
import PollCardWithOneImage from "../Home/PollCardWithOneImage";
import PollCardwithMultiImage from "../Home/PollCardwithMultiImage";
import Header from "../Home/Header";
import Sidebar from "../Home/Sidebar";
import RightBar from "../Home/RightBar";
import { API_BASE_URL } from "../../Redux/Config";
import {
  fetchFollowers,
  fetchFollowing,
  fetchUserPolls,
  fetchUserProfile,
} from "../../Redux/Profile";

function Home() {
  const [tab, setTab] = useState("polls");
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get("user_id") || null;

  const [profile, setProfile] = useState(null);
  const [polls, setPolls] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const profileData = await fetchUserProfile(userIdParam || undefined);
        if (cancelled) return;
        setProfile(profileData);

        const targetId = profileData?.id || userIdParam;
        if (!targetId) throw new Error("Missing user id.");

        const [pollData, followerData, followingData] = await Promise.all([
          fetchUserPolls(targetId).catch(() => []),
          fetchFollowers(targetId).catch(() => []),
          fetchFollowing(targetId).catch(() => []),
        ]);

        if (cancelled) return;
        setPolls(pollData);
        setFollowers(followerData);
        setFollowing(followingData);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Unable to load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [userIdParam]);

  const pollsContent = useMemo(() => {
    if (loading) {
      return <div className="text-sm text-gray-500">Loading polls...</div>;
    }
    if (error) {
      return <div className="text-sm text-red-500">{error}</div>;
    }
    if (!polls.length) {
      return <div className="text-sm text-gray-500">No polls yet.</div>;
    }

    return polls.map((poll, idx) => {
      const type = poll.poll_type || poll.type;
      const key = poll.id || idx;
      if (type === "single_image")
        return <PollCardWithOneImage pollData={poll} key={key} />;
      if (type === "multiple_images")
        return <PollCardwithMultiImage pollData={poll} key={key} />;
      return <PollCard pollData={poll} key={key} />;
    });
  }, [loading, error, polls]);

  const followerList = useMemo(() => {
    if (loading)
      return <div className="text-sm text-gray-500">Loading followers...</div>;
    if (error) return <div className="text-sm text-red-500">{error}</div>;
    if (!followers.length)
      return <div className="text-sm text-gray-500">No followers yet.</div>;
    return (
      <ul className="space-y-4">
        {followers.map((p) => {
          const profilePath = p.username
            ? `/user/${encodeURIComponent(p.username)}${p.id ? `?user_id=${encodeURIComponent(p.id)}` : ""}`
            : p.id
              ? `/user/?user_id=${encodeURIComponent(p.id)}`
              : "/user/";
          return (
            <li
              key={p.id || p.username || Math.random()}
              className="flex items-center justify-between"
            >
              <Link
                to={profilePath}
                className="flex items-center gap-4 hover:bg-gray-50 rounded-lg px-2 py-1 w-full"
              >
                <img
                  src={
                    p.image
                      ? p.image.startsWith("http")
                        ? p.image
                        : `${API_BASE_URL}/${p.image}`
                      : "/dummyavatar.jpg"
                  }
                  alt={p.name || p.username || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {p.name || p.username || "User"}
                  </div>
                  {p.username && (
                    <div className="text-xs text-gray-500">@{p.username}</div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }, [loading, error, followers]);

  const followingList = useMemo(() => {
    if (loading)
      return <div className="text-sm text-gray-500">Loading following...</div>;
    if (error) return <div className="text-sm text-red-500">{error}</div>;
    if (!following.length)
      return (
        <div className="text-sm text-gray-500">Not following anyone yet.</div>
      );
    return (
      <ul className="space-y-4">
        {following.map((p) => {
          const profilePath = p.username
            ? `/user/${encodeURIComponent(p.username)}${p.id ? `?user_id=${encodeURIComponent(p.id)}` : ""}`
            : p.id
              ? `/user/?user_id=${encodeURIComponent(p.id)}`
              : "/user/";
          return (
            <li
              key={p.id || p.username || Math.random()}
              className="flex items-center justify-between"
            >
              <Link
                to={profilePath}
                className="flex items-center gap-4 hover:bg-gray-50 rounded-lg px-2 py-1 w-full"
              >
                <img
                  src={
                    p.image
                      ? p.image.startsWith("http")
                        ? p.image
                        : `${API_BASE_URL}/${p.image}`
                      : "/dummyavatar.jpg"
                  }
                  alt={p.name || p.username || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {p.name || p.username || "User"}
                  </div>
                  {p.username && (
                    <div className="text-xs text-gray-500">@{p.username}</div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }, [loading, error, following]);

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 ">
        <Header />
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-16 mt-6 max-w-[1536px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Sticky */}
          <div className="col-span-12 lg:col-span-2">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>

          {/* Main content - Scrollable */}
          <div className="col-span-12 lg:col-span-7 pb-24 md:pb-16">
            <UserCard profile={profile} loading={loading} error={error} />

            <div className="mt-6 bg-white rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setTab("polls")}
                  className={`px-3 py-2 rounded-md text-sm ${
                    tab === "polls"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600"
                  }`}
                >
                  Polls
                </button>
                <button
                  onClick={() => setTab("followers")}
                  className={`px-3 py-2 rounded-md text-sm ${
                    tab === "followers"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600"
                  }`}
                >
                  Followers
                </button>
                <button
                  onClick={() => setTab("following")}
                  className={`px-3 py-2 rounded-md text-sm ${
                    tab === "following"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600"
                  }`}
                >
                  Following
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {tab === "polls" && pollsContent}

              {tab === "followers" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  {followerList}
                </div>
              )}

              {tab === "following" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  {followingList}
                </div>
              )}
            </div>
          </div>

          {/* Right bar - Sticky */}
          <div className="col-span-12 lg:col-span-3 pb-20 md:pb-0">
            <div className="sticky top-24">
              <RightBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
