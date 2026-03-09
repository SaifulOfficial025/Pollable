import React, { useState } from "react";

function BlockedUser() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Jubayer Ahmad",
      handle: "@ahmadjubayerr",
      avatar: "/dummyavatar.jpg",
    },
    {
      id: 2,
      name: "Jubayer Ahmad",
      handle: "@ahmadjubayerr",
      avatar: "/dummyavatar.jpg",
    },
    {
      id: 3,
      name: "Jubayer Ahmad",
      handle: "@ahmadjubayerr",
      avatar: "/dummyavatar.jpg",
    },
    {
      id: 4,
      name: "Jubayer Ahmad",
      handle: "@ahmadjubayerr",
      avatar: "/dummyavatar.jpg",
    },
    {
      id: 5,
      name: "Jubayer Ahmad",
      handle: "@ahmadjubayerr",
      avatar: "/dummyavatar.jpg",
    },
    {
      id: 6,
      name: "Jubayer Ahmad",
      handle: "@ahmadjubayerr",
      avatar: "/dummyavatar.jpg",
    },
    {
      id: 7,
      name: "Jubayer Ahmad",
      handle: "@ahmadjubayerr",
      avatar: "/dummyavatar.jpg",
    },
    {
      id: 8,
      name: "Jubayer Ahmad",
      handle: "@ahmadjubayerr",
      avatar: "/dummyavatar.jpg",
    },
  ]);

  function handleUnblock(id) {
    setUsers((s) => s.filter((u) => u.id !== id));
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">
        Blocked Users
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Once you block someone, that person can no longer see things you polls,
        start a conversation with you, or add you as a friend.
      </p>

      <div className="space-y-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-4">
              <img
                src={u.avatar}
                alt={u.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {u.name}
                </div>
                <div className="text-xs text-gray-500">{u.handle}</div>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <button
                onClick={() => handleUnblock(u.id)}
                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm hover:bg-indigo-100 focus:outline-none w-full sm:w-auto text-center"
              >
                Unblock
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlockedUser;
