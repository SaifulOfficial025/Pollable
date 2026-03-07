import React, { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { BsShare } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import CommentModal from "./CommentModal";
import PollDemographicModal from "./PollDemographicModal";
import { Link } from "react-router-dom";

function PollCard() {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDemographics, setShowDemographics] = useState(false);

  const options = [
    { label: "Fully Remote", votes: 684, percent: 68 },
    { label: "Hybrid (2-3 days office)", votes: 241, percent: 24 },
    { label: "Full-time Office", votes: 80, percent: 8 },
  ];

  return (
    <>
      <div className="max-w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <Link to="/user/">
            <div className="flex items-center gap-3">
              <img
                src="/dummyavatar.jpg"
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-md font-bold text-black">
                  Sarah Johnson
                </div>
                <div className="text-xs text-gray-600">2 hours ago</div>
              </div>
            </div>
          </Link>

          <div className="text-gray-400 text-lg">
            <BsThreeDotsVertical />
          </div>
        </div>

        {/* Question */}
        <h3 className="mt-4 text-black text-lg font-semibold">
          What is your preferred work model post-pandemic?
        </h3>

        {/* Poll options */}
        <div className="mt-4 space-y-3">
          {options.map((opt, idx) => (
            <div key={idx} className="relative flex items-center gap-3">
              <div className="flex-1 relative">
                <div className="w-full bg-blue-50 rounded-lg h-14 flex items-center relative overflow-hidden">
                  <div
                    className="bg-blue-200 h-14 rounded-lg absolute top-0 left-0"
                    style={{
                      width: `${opt.percent}%`,
                      transition: "width .4s",
                    }}
                  />
                  <div className="absolute left-6 z-10">
                    <span className="text-md text-black font-semibold">
                      {opt.label}
                    </span>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                    <div className="text-sm text-gray-500  px-2 rounded">
                      {opt.votes} votes
                    </div>
                    <div className="text-lg text-[#4c8df6] font-bold  px-2 rounded">
                      {opt.percent}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

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
              <span className="text-gray-700">138</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowComments(true)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <FaRegComment className="text-lg text-gray-500" />
                <span className="text-gray-700">47 comments</span>
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

export default PollCard;
