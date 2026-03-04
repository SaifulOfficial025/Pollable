import React, { useState } from "react";

function CommentModal({ initialOpen = true, onClose }) {
  const [open, setOpen] = useState(initialOpen);

  function handleClose() {
    setOpen(false);
    if (onClose) onClose();
  }

  const comments = [
    {
      id: 1,
      name: "Mike Johnson",
      avatar: "/dummyavatar.jpg",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam nisi, cras neque, lorem vel vulputate vitae aliquam.",
      time: "5m",
    },
    {
      id: 2,
      name: "Mike Johnson",
      avatar: "/dummyavatar.jpg",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam nisi, cras neque, lorem vel vulputate vitae aliquam.",
      time: "5m",
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "/dummyavatar.jpg",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam nisi, cras neque, lorem vel vulputate vitae aliquam.",
      time: "5m",
    },
    {
      id: 4,
      name: "Mike Johnson",
      avatar: "/dummyavatar.jpg",
      text: "Pretium tristique nisi, ut commodo fames. Porttitor et sagittis egestas vitae metus, odio tristique amet, duis. Nunc tortor elit aliquet quis in mauris.",
      time: "5m",
    },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="text-sm text-gray-600 font-medium">
            Comment <span className="text-gray-400">• 2,564</span>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close comments"
            className="text-gray-400 hover:text-gray-700 text-lg font-medium focus:outline-none"
          >
            ×
          </button>
        </div>

        {/* Comments list */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-4">
              <img
                src={c.avatar}
                alt={c.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="text-sm font-semibold text-gray-800">
                    {c.name}
                  </div>
                  <div className="text-xs text-gray-400">{c.time}</div>
                </div>
                <div className="mt-2 bg-blue-50 text-gray-700 rounded-lg p-3 text-sm">
                  {c.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src="/dummyavatar.jpg"
              alt="you"
              className="w-9 h-9 rounded-full object-cover"
            />
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
