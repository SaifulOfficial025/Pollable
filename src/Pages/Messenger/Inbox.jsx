import React, { useState, useRef, useEffect } from "react";
import { IoImage } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import Button from "../../Shared/Button";

function Inbox({ selectedChat }) {
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [images, setImages] = useState([]);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Dummy chat messages
  const dummyMessages = selectedChat?.isRequest
    ? [
        {
          id: 1,
          sender: selectedChat.name,
          text: "Hi! I'd like to connect with you.",
          time: "Yesterday",
          isMine: false,
        },
      ]
    : [
        {
          id: 1,
          sender: "Sarah Johnson",
          text: "Hey! I saw your poll about remote work.",
          time: "9:15 AM",
          isMine: false,
        },
        {
          id: 2,
          sender: "You",
          text: "Yes! Getting great engagement so far.",
          time: "9:16 AM",
          isMine: true,
        },
        {
          id: 3,
          sender: "Sarah Johnson",
          text: "The demographic breakdown is fascinating. 68% prefer remote!",
          time: "9:18 AM",
          isMine: false,
        },
        {
          id: 4,
          sender: "You",
          text: "I know! Much higher than I expected. The age distribution shows interesting trends too.",
          time: "9:20 AM",
          isMine: true,
        },
        {
          id: 5,
          sender: "Sarah Johnson",
          text: "Have you shared the results with your team yet?",
          time: "9:22 AM",
          isMine: false,
        },
        {
          id: 6,
          sender: "You",
          text: "Not yet, planning to present them in tomorrow's meeting.",
          time: "9:25 AM",
          isMine: true,
        },
        {
          id: 7,
          sender: "Sarah Johnson",
          text: "That's exciting! I'd love to hear how it goes.",
          time: "9:27 AM",
          isMine: false,
        },
        {
          id: 8,
          sender: "You",
          text: "Will do! The hybrid option got 24% which is also interesting.",
          time: "9:30 AM",
          isMine: true,
        },
        {
          id: 9,
          sender: "Sarah Johnson",
          text: "Yes, I noticed that. Some people still value in-person collaboration.",
          time: "9:32 AM",
          isMine: false,
        },
        {
          id: 10,
          sender: "You",
          text: "Absolutely. The full-time office option got the least votes at 8%.",
          time: "9:35 AM",
          isMine: true,
        },
        {
          id: 11,
          sender: "Sarah Johnson",
          text: "Makes sense given how everyone's adapted to remote work.",
          time: "9:38 AM",
          isMine: false,
        },
        {
          id: 12,
          sender: "You",
          text: "Exactly! Technology has come a long way.",
          time: "9:40 AM",
          isMine: true,
        },
        {
          id: 13,
          sender: "Sarah Johnson",
          text: "Did you get any comments from the voters?",
          time: "9:42 AM",
          isMine: false,
        },
        {
          id: 14,
          sender: "You",
          text: "Yes, over 150 comments! People are really passionate about this topic.",
          time: "9:45 AM",
          isMine: true,
        },
        {
          id: 15,
          sender: "Sarah Johnson",
          text: "Wow! That's amazing engagement. What are people saying?",
          time: "9:47 AM",
          isMine: false,
        },
        {
          id: 16,
          sender: "You",
          text: "Mostly discussing work-life balance and productivity concerns.",
          time: "9:50 AM",
          isMine: true,
        },
        {
          id: 17,
          sender: "Sarah Johnson",
          text: "Those are definitely the hot topics right now.",
          time: "9:52 AM",
          isMine: false,
        },
        {
          id: 18,
          sender: "You",
          text: "I'm thinking of creating a follow-up poll about productivity tools.",
          time: "9:55 AM",
          isMine: true,
        },
        {
          id: 19,
          sender: "Sarah Johnson",
          text: "Great idea! What tools are you thinking about?",
          time: "10:00 AM",
          isMine: false,
        },
        {
          id: 20,
          sender: "You",
          text: "Project management, communication apps, time tracking - that sort of thing.",
          time: "10:02 AM",
          isMine: true,
        },
        {
          id: 21,
          sender: "Sarah Johnson",
          text: "Nice! I'd definitely vote on that poll.",
          time: "10:05 AM",
          isMine: false,
        },
        {
          id: 22,
          sender: "You",
          text: "I'll tag you when it's live!",
          time: "10:07 AM",
          isMine: true,
        },
        {
          id: 23,
          sender: "Sarah Johnson",
          text: "Perfect! Thanks for the interesting conversation.",
          time: "10:10 AM",
          isMine: false,
        },
        {
          id: 24,
          sender: "You",
          text: "Anytime! Always great chatting about these topics.",
          time: "10:12 AM",
          isMine: true,
        },
        {
          id: 25,
          sender: "Sarah Johnson",
          text: "Same here! Talk soon.",
          time: "10:15 AM",
          isMine: false,
        },
      ];

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      console.log("Sending:", message);
      setMessage("");
      // Clear selected images on send as dummy behavior
      setImages([]);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    // reset input so selecting the same file again still triggers onChange
    e.target.value = "";
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-white flex flex-col rounded-xl border border-gray-200">
      {/* Header - Fixed */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={selectedChat.avatar}
              alt={selectedChat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {selectedChat.active && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {selectedChat.name}
            </h3>
            <p className="text-xs text-green-600">
              {selectedChat.isRequest
                ? selectedChat.handle || ""
                : selectedChat.active
                  ? "Active now"
                  : "Offline"}
            </p>
          </div>
        </div>

        {/* Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BsThreeDotsVertical className="text-gray-600" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <Link to="/user">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  View Profile
                </button>
              </Link>

              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                Follow
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                Delete
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                Block
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {dummyMessages.map((msg) => (
          <div key={msg.id}>
            <div className="text-xs text-gray-500 mb-1">{msg.sender}</div>
            <div
              className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-2xl ${
                  msg.isMine
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
            <div
              className={`text-xs text-gray-500 mt-1 ${
                msg.isMine ? "text-right" : "text-left"
              }`}
            >
              {msg.time}
            </div>
          </div>
        ))}
      </div>

      {/* Selected image previews */}
      {images.length > 0 && (
        <div className="px-6 pt-2 flex gap-2 flex-wrap border-t border-gray-200 bg-gray-50">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200"
            >
              <img
                src={img.url}
                alt="Attachment preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(img.id)}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center text-xs text-gray-700 hover:bg-gray-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input or Action Buttons for Message Requests - Fixed at bottom */}
      {selectedChat?.isRequest ? (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            If you accept, {selectedChat.name} will be able to call you and may
            see information like your active status and when you've read
            messages.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-red-600 hover:text-red-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Block
            </button>
            <button
              type="button"
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-red-600 hover:text-red-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Delete
            </button>
            <div className="flex-1">
              <Button label="Accept" fullWidth size="md" />
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleImageClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoImage className="text-gray-600 text-3xl" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="w-full pl-4 pr-14 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleSend}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 hover:scale-105 transition-transform"
              >
                <img src="/sendbutton.svg" alt="Send" className="w-10 h-10" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inbox;
