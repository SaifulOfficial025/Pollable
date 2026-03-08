import React, { useState, useEffect, useRef } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { BsShare, BsThreeDotsVertical } from "react-icons/bs";
import { IoBookmarkOutline } from "react-icons/io5";
import { FiFlag } from "react-icons/fi";
import CommentModal from "./CommentModal";
import PollDemographicModal from "./PollDemographicModal";
import { Link } from "react-router-dom";

function PollCardwithMultiImage({ pollData }) {
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
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      timeAgo: "1 hour ago",
    },
    question = "What's your question?",
    options = [
      {
        id: 1,
        label: "The Nomad Minimalist",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        votes: 300,
        percent: 30,
      },
      {
        id: 2,
        label: "The Playful Romantic",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        votes: 300,
        percent: 30,
      },
      {
        id: 3,
        label: "The Real Gentleman",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        votes: 300,
        percent: 30,
      },
      {
        id: 4,
        label: "The Bold Adventurer",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        votes: 100,
        percent: 10,
      },
    ],
    likes = 245,
    comments = 82,
  } = pollData || {};

  const hasVoted = selectedOption !== null;

  // Dynamic grid layout based on number of options
  const getGridCols = () => {
    const count = options.length;
    if (count <= 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2 md:grid-cols-4";
    if (count <= 6) return "grid-cols-2 md:grid-cols-3";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  return (
    <>
      <div className="max-w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
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
                <div className="text-xs text-gray-600">{user.timeAgo}</div>
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
        <h3 className="mt-4 text-black text-lg font-semibold">{question}</h3>

        {/* Poll image options */}
        <div className={`mt-4 grid ${getGridCols()} gap-3`}>
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  setSelectedOption((prev) => (prev === opt.id ? null : opt.id))
                }
                className="relative group focus:outline-none"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden transition-transform duration-150 ease-out hover:scale-[1.02]">
                  {/* Image */}
                  <img
                    src={opt.image}
                    alt={opt.label}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay when voted and has percentage */}
                  {hasVoted && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                        isSelected
                          ? "bg-gradient-to-br from-[#4a90e2]/80 to-[#7c3bed]/80"
                          : "bg-black/20"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`text-4xl font-bold ${
                            isSelected ? "text-white" : "text-white"
                          }`}
                        >
                          {opt.percent}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Label at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate">
                      {opt.label}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Total votes display after voting */}
        {hasVoted && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Total votes:{" "}
              {options
                .reduce((sum, opt) => sum + opt.votes, 0)
                .toLocaleString()}
            </p>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-5 border-t pt-4 text-sm text-gray-500">
          <div className="grid grid-cols-4 items-center text-center">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setLiked(!liked)}
                className="flex items-center gap-2 text-gray-500 hover:text-red-500 h-8"
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  {liked ? (
                    <FaHeart className="text-red-600 text-xl" />
                  ) : (
                    <CiHeart className="text-xl" />
                  )}
                </span>
              </button>
              <span className="text-gray-700">{likes}</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowComments(true)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <FaRegComment className="text-lg text-gray-500" />
                <span className="text-gray-700">{comments} comments</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowDemographics(true)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <img
                  src="/demographic.svg"
                  alt="demographics"
                  className="w-5 h-5"
                />
                <span className="text-gray-700">Demographics</span>
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

export default PollCardwithMultiImage;
