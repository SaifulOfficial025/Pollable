import React, { useState, useEffect, useRef } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { BsShare, BsThreeDotsVertical } from "react-icons/bs";
import { IoBookmarkOutline } from "react-icons/io5";
import { FiFlag } from "react-icons/fi";
import CommentModal from "./CommentModal";
import PollDemographicModal from "./PollDemographicModal";
import { Link } from "react-router-dom";

function PollCardWithOneImage({ pollData }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDemographics, setShowDemographics] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const {
    user = {
      name: "Anonymous User",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      timeAgo: "1 hour ago",
    },
    question = "What's your question?",
    bannerImage = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
    options = [
      { label: "Twitter/X", votes: 420, percent: 42 },
      { label: "Reddit", votes: 260, percent: 26 },
      { label: "Instagram", votes: 190, percent: 19 },
      { label: "Traditional news sites", votes: 130, percent: 13 },
    ],
    likes = 245,
    comments = 82,
    Polloftheday = false,
  } = pollData || {};

  return (
    <>
      <div
        className={`max-w-full rounded-2xl border shadow-sm p-3 sm:p-5 ${
          Polloftheday
            ? "bg-gradient-to-br from-[#dbe8f9] to-[#e5d8fb] border-purple-200"
            : "bg-white border-gray-100"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <Link to="/user/">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-md font-bold text-black">{user.name}</div>
                <div className="text-xs text-gray-600">
                  {Polloftheday ? (
                    <span className="flex items-center gap-1 font-semibold text-purple-600">
                      <span>⭐</span>
                      Poll of the day
                    </span>
                  ) : (
                    user.timeAgo
                  )}
                </div>
              </div>
            </div>
          </Link>

          <div ref={menuRef} className="relative text-gray-400 text-lg">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <BsThreeDotsVertical />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-20 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setIsAnonymous((prev) => !prev);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 gap-3 text-sm font-medium rounded-lg bg-white hover:bg-gray-50 text-gray-800 transition-colors duration-150 cursor-pointer"
                >
                  <img
                    src="/anonymous.svg"
                    alt="anonymous vote"
                    className="w-5 h-5"
                  />
                  <span className="font-semibold text-md flex-1 text-left">
                    Vote Anonymously?
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAnonymous((prev) => !prev);
                    }}
                    className={`ml-2 w-9 h-5 rounded-full flex items-center px-0.5 transition-colors duration-150 ${
                      isAnonymous
                        ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] justify-end"
                        : "bg-gray-300 justify-start"
                    }`}
                  >
                    <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMenu(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                >
                  <IoBookmarkOutline className="w-5 h-5" />
                  <span className="font-semibold text-md">Bookmark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMenu(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-red-500"
                >
                  <FiFlag className="w-5 h-5" />
                  <span className="font-semibold text-md">Report</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Question */}
        <h3 className="mt-4 text-black text-base sm:text-lg font-semibold">
          {question}
        </h3>

        {/* Banner Image */}
        <div className="mt-4">
          <img
            src={bannerImage}
            alt="poll banner"
            className="w-full h-48 sm:h-72 object-cover rounded-2xl"
          />
        </div>

        {/* Poll options */}
        <div className="mt-4 space-y-3">
          {options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const hasVoted = selectedOption !== null;
            return (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  setSelectedOption((prev) => (prev === idx ? null : idx))
                }
                className="w-full text-left focus:outline-none"
              >
                <div className="relative flex items-center gap-3 transition-transform duration-150 ease-out hover:-translate-y-0.5">
                  <div className="flex-1 relative">
                    <div
                      className={`w-full rounded-lg h-11 sm:h-14 flex items-center relative overflow-hidden transition-shadow duration-150 bg-blue-50 ${
                        !isSelected ? "hover:shadow-md" : ""
                      }`}
                    >
                      <div
                        className={`h-11 sm:h-14 rounded-lg absolute top-0 left-0 transition-[width] duration-300 ${
                          isSelected
                            ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]"
                            : "bg-blue-200"
                        }`}
                        style={{
                          width: hasVoted ? `${opt.percent}%` : "0%",
                        }}
                      />
                      <div className="absolute left-3 sm:left-6 z-10">
                        <span
                          className={`text-sm sm:text-md font-semibold ${
                            isSelected ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </div>
                      <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2 z-10">
                        {hasVoted && (
                          <>
                            <div className="hidden sm:block text-sm text-gray-600 px-2 rounded">
                              {opt.votes} votes
                            </div>
                            <div className="text-sm sm:text-lg font-bold text-[#4c8df6] px-1 sm:px-2 rounded">
                              {opt.percent}%
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="mt-5 border-t pt-4 text-sm text-gray-500">
          <div className="grid grid-cols-4 items-center text-center">
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <button
                onClick={() => setLiked(!liked)}
                className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-red-500 h-8"
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  {liked ? (
                    <FaHeart className="text-red-600 text-xl" />
                  ) : (
                    <CiHeart className="text-xl" />
                  )}
                </span>
              </button>
              <span className="text-gray-700 text-xs sm:text-sm">{likes}</span>
            </div>

            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowComments(true)}
                className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <FaRegComment className="text-lg text-gray-500" />
                <span className="text-gray-700 hidden sm:inline">
                  {comments} comments
                </span>
                <span className="text-gray-700 sm:hidden text-xs">
                  {comments}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowDemographics(true)}
                className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <img
                  src="/demographic.svg"
                  alt="demographics"
                  className="w-5 h-5"
                />
                <span className="text-gray-700 hidden sm:inline">
                  Demographics
                </span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2">
              <BsShare className="text-lg text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      {showComments && (
        <CommentModal
          initialOpen={true}
          onClose={() => setShowComments(false)}
        />
      )}
      {showDemographics && (
        <PollDemographicModal
          initialOpen={true}
          onClose={() => setShowDemographics(false)}
        />
      )}
    </>
  );
}

export default PollCardWithOneImage;
