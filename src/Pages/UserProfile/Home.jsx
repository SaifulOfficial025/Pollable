import React, { useState } from "react";
import UserCard from "./UserCard";
import PollCard from "../Home/PollCard";
import Button from "../../Shared/Button";
import Header from "../Home/Header";

function Home() {
  const [tab, setTab] = useState("polls");

  const people = [
    {
      id: 1,
      name: "Jubayer Ahmad",
      handle: "@ahmadjubayerr",
      avatar: "/dummyavatar.jpg",
    },
    { id: 2, name: "Sara Lee", handle: "@saralee", avatar: "/dummyavatar.jpg" },
    {
      id: 3,
      name: "Michael Chen",
      handle: "@michaelc",
      avatar: "/dummyavatar.jpg",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      handle: "@emilyr",
      avatar: "/dummyavatar.jpg",
    },
  ];

  const [following, setFollowing] = useState({});

  function toggleFollow(id) {
    setFollowing((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <UserCard />

        <div className="mt-6 bg-white rounded-lg border border-gray-100 p-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setTab("polls")}
              className={`px-3 py-2 rounded-md text-sm ${tab === "polls" ? "bg-indigo-50 text-indigo-600" : "text-gray-600"}`}
            >
              Polls
            </button>
            <button
              onClick={() => setTab("followers")}
              className={`px-3 py-2 rounded-md text-sm ${tab === "followers" ? "bg-indigo-50 text-indigo-600" : "text-gray-600"}`}
            >
              Followers
            </button>
            <button
              onClick={() => setTab("following")}
              className={`px-3 py-2 rounded-md text-sm ${tab === "following" ? "bg-indigo-50 text-indigo-600" : "text-gray-600"}`}
            >
              Following
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {tab === "polls" && (
            <>
              <PollCard />
              <PollCard />
              <PollCard />
            </>
          )}

          {(tab === "followers" || tab === "following") && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <ul className="space-y-4">
                {people.map((p) => (
                  <li key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {p.name}
                        </div>
                        <div className="text-xs text-gray-500">{p.handle}</div>
                      </div>
                    </div>

                    <div>
                      <Button
                        label={following[p.id] ? "Following" : "Follow"}
                        onClick={() => toggleFollow(p.id)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
