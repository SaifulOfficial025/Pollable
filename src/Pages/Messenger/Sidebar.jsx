import React, { useState } from "react";
import { IoSearchOutline, IoChevronBack } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";

function Sidebar({ selectedChat, onSelectChat }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMessageRequests, setShowMessageRequests] = useState(false);

  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      message: "Thanks for sharing that poll!",
      time: "2m ago",
      avatar: "/dummyavatar.jpg",
      active: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      message: "What do you think about the results?",
      time: "1h ago",
      avatar: "/dummyavatar.jpg",
      active: false,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      message: "Great question! I voted.",
      time: "3h ago",
      avatar: "/dummyavatar.jpg",
      active: false,
    },
    {
      id: 4,
      name: "David Kim",
      message: "Can you boost my poll?",
      time: "1d ago",
      avatar: "/dummyavatar.jpg",
      active: false,
    },
  ];

  const messageRequests = [
    {
      id: 101,
      name: "Jubayer Ahmad",
      handle: "@ahmadjubayerr",
      message: "Hi! I'd like to connect with you.",
      time: "1d ago",
      avatar: "/dummyavatar.jpg",
      isRequest: true,
    },
  ];

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header - Search Bar or Request Header */}
      {!showMessageRequests ? (
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <button
            onClick={() => {
              setShowMessageRequests(false);
              onSelectChat(null);
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoChevronBack className="text-xl text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            All Messages Request
          </h2>
        </div>
      )}

      {/* Message Request Banner */}
      {!showMessageRequests && (
        <div
          onClick={() => setShowMessageRequests(true)}
          className="px-4 py-3 bg-orange-50 border-b border-orange-100 flex items-center gap-3 cursor-pointer hover:bg-orange-100 transition-colors"
        >
          <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center">
            <MdOutlineMailOutline className="text-white text-xl" />
          </div>
          <span className="text-sm font-medium text-gray-800">
            1 message request
          </span>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {(showMessageRequests ? messageRequests : conversations).map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelectChat(conv)}
            className={`relative flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#f4f9fd] transition-colors ${
              selectedChat?.id === conv.id ? "bg-[#eff6ff]" : ""
            }`}
          >
            {/* Blue left border for selected */}
            {selectedChat?.id === conv.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            )}

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={conv.avatar}
                alt={conv.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {conv.active && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900 text-sm truncate">
                  {conv.name}
                </h4>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {conv.time}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">{conv.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
