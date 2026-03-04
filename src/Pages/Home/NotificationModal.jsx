import React, { useState } from "react";

function NotificationModal({ initialOpen = true, onClose }) {
  const [open, setOpen] = useState(initialOpen);

  const notifications = [
    {
      id: 1,
      title: "Your poll reached 1,000 votes!",
      body: '"What is your preferred work model post-pandemic?"',
      time: "3 hours ago",
      action: { label: "View Demographics" },
      avatar: "/dummyavatar.jpg",
    },
    {
      id: 2,
      title: "David Kim voted on your poll",
      body: '"Which programming language should beginners learn first?"',
      time: "5 hours ago",
      avatar: "/dummyavatar.jpg",
    },
    {
      id: 3,
      title: "Lisa Martinez started following you",
      body: "",
      time: "8 hours ago",
      action: { label: "Follow Back" },
      avatar: "/dummyavatar.jpg",
    },
    {
      id: 4,
      title: "James Wilson liked your comment",
      body: '"Should remote work be a legal right?"',
      time: "1 day ago",
      avatar: "/dummyavatar.jpg",
    },
    {
      id: 5,
      title: "Nina Patel mentioned you in a comment",
      body: '"@demouser would love to hear your thoughts on this!"',
      time: "1 day ago",
      avatar: "/dummyavatar.jpg",
    },
    {
      id: 6,
      title: "You reached 2,500 followers!",
      body: "",
      time: "2 days ago",
      avatar: "/dummyavatar.jpg",
    },
  ];

  function handleClose() {
    setOpen(false);
    if (onClose) onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="text-sm font-medium text-gray-800">Notifications</div>
          <button
            onClick={handleClose}
            aria-label="Close notifications"
            className="text-gray-400 hover:text-gray-700 text-lg font-medium focus:outline-none"
          >
            ×
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="rounded-lg border border-gray-100 p-4 bg-white"
            >
              <div className="flex items-start gap-4">
                <img
                  src={n.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="text-sm font-semibold text-gray-800">
                      {n.title}
                    </div>
                    <div className="text-xs text-gray-400">{n.time}</div>
                  </div>

                  {n.body && (
                    <div className="mt-2 text-sm text-gray-600">{n.body}</div>
                  )}

                  {n.action && (
                    <div className="mt-3">
                      <button className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-100">
                        {n.action.label}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
