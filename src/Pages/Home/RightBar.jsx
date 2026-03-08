import React from "react";
import { AiFillStar } from "react-icons/ai";
import { IoMdTrendingUp } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import Button from "../../Shared/Button";

function RightBar() {
  return (
    <aside className="w-full space-y-4">
      {/* Poll of the Day */}
      <div className="bg-gradient-to-br from-[#dbe8f9] to-[#e5d8fb] rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white shadow-sm">
            <AiFillStar className="text-yellow-400 text-2xl" />
          </span>
          <h4 className="text-lg font-semibold text-gray-900">
            Poll of the Day
          </h4>
        </div>

        <div className="mt-3  rounded-lg p-3">
          <p className="text-md font-semibold text-black font-medium">
            Should companies be required to disclose salary ranges in job
            postings?
          </p>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-500">23.4K votes</div>
            <Button
              size="md"
              onClick={() => alert("Vote functionality coming soon!")}
            >
              Vote Now
            </Button>
          </div>
        </div>
      </div>

      {/* Trending Polls */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2">
          <IoMdTrendingUp className="text-purple-600 text-xl" />
          <h4 className="text-md font-semibold text-gray-800">
            Trending Polls
          </h4>
        </div>

        <ul className="mt-3 space-y-3 text-sm text-black ">
          <li className="hover:scale-105 transition-transform duration-150">
            <div className="font-medium">
              Should remote work be a legal right?
            </div>
            <div className="text-xs text-gray-400 mt-1">15.2K votes</div>
          </li>

          <li className="border-t pt-3 hover:scale-105 transition-transform duration-150">
            <div className="font-medium">Electric vehicles by 2030?</div>
            <div className="text-xs text-gray-400 mt-1">12.8K votes</div>
          </li>

          <li className="border-t pt-3 hover:scale-105 transition-transform duration-150">
            <div className="font-medium">
              Universal basic income feasibility
            </div>
            <div className="text-xs text-gray-400 mt-1">9.4K votes</div>
          </li>
        </ul>
      </div>

      {/* Suggested Polls */}
      {/* <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2">
          <FaUsers className="text-cyan-600 text-lg" />
          <h4 className="text-md font-semibold text-gray-800">
            Suggested Polls
          </h4>
        </div>

        <div className="mt-3 space-y-3">
          <div className="bg-gray-50 rounded-md p-3">
            <div className="text-sm font-medium">Climate change priorities</div>
            <div className="text-xs text-gray-600 mt-1 font-medium">
              Environment • 8.2K votes
            </div>
          </div>

          <div className="bg-gray-50 rounded-md p-3">
            <div className="text-sm font-medium">Cryptocurrency regulation</div>
            <div className="text-xs text-gray-600 mt-1 font-medium">
              Finance • 12.5K votes
            </div>
          </div>

          <div className="bg-gray-50 rounded-md p-3">
            <div className="text-sm font-medium">Healthcare reform options</div>
            <div className="text-xs text-gray-600 mt-1 font-medium">
              Politics • 18.9K votes
            </div>
          </div>
        </div>
      </div> */}
    </aside>
  );
}

export default RightBar;
