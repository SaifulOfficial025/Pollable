import React from "react";
import { GrHomeRounded } from "react-icons/gr";
import { IoMdAddCircleOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaRegBookmark } from "react-icons/fa6";
import { FiMessageCircle, FiCreditCard } from "react-icons/fi";
import { Link } from "react-router-dom";

function Sidebar({ setMainView }) {
  return (
    <aside className="w-full">
      <nav className="flex flex-col">
        <button
          onClick={() => setMainView && setMainView("feed")}
          className="flex items-center gap-3 bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white px-4 py-3 rounded-md"
        >
          <GrHomeRounded className="text-white text-xl" />
          <span className="font-semibold">Home</span>
        </button>

        <div className="mt-4 flex flex-col gap-3 text-gray-700">
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("openPostPoll"))
            }
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50"
          >
            <IoMdAddCircleOutline className="text-2xl text-gray-700" />
            <span>Create Poll</span>
          </button>

          <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50">
            <CgProfile className="text-xl text-gray-700" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setMainView && setMainView("saved")}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50"
          >
            <FaRegBookmark className="text-lg text-gray-700" />
            <span>Saved Polls</span>
          </button>

          <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50">
            <FiMessageCircle className="text-xl text-gray-700" />
            <span>Messages</span>
          </button>
        </div>

        <div className="mt-5 border-t pt-4">
          <ul className="text-gray-700">
            <li className="px-3 py-2 flex items-center gap-3 rounded-md hover:bg-gray-50">
              <FiCreditCard className="text-lg text-gray-700" />
              <span>Upgrade</span>
            </li>
          </ul>

          <Link to="/plans" className="block mt-4">
            <div className="mt-4 p-4 rounded-md bg-[#3b82f6] text-white">
              <h4 className="font-semibold">Upgrade to Premium</h4>
              <p className="text-sm opacity-90 mt-2">
                Get advanced insights and boost credits
              </p>
              <button className="mt-4 w-full bg-white text-[#4a90e2] font-semibold py-2 rounded-md">
                Upgrade
              </button>
            </div>
          </Link>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
