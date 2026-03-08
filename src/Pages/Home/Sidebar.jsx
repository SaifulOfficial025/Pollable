import React from "react";
import { createPortal } from "react-dom";
import { GrHomeRounded } from "react-icons/gr";
import { IoMdAddCircleOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaRegBookmark } from "react-icons/fa6";
import { FiMessageCircle, FiCreditCard } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  return (
    <>
      {/* Desktop / tablet sidebar */}
      <aside className="w-full hidden md:block">
        <nav className="flex flex-col">
          <Link to="/">
            <button
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-md ${
                location.pathname === "/"
                  ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <GrHomeRounded
                className={`text-xl ${location.pathname === "/" ? "text-white" : "text-gray-700"}`}
              />
              <span
                className={location.pathname === "/" ? "font-semibold" : ""}
              >
                Home
              </span>
            </button>
          </Link>

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

            <Link to="/user">
              <button
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md ${
                  location.pathname === "/user" ||
                  location.pathname === "/user/"
                    ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <CgProfile
                  className={`text-xl ${location.pathname === "/user" || location.pathname === "/user/" ? "text-white" : "text-gray-700"}`}
                />
                <span
                  className={
                    location.pathname === "/user" ||
                    location.pathname === "/user/"
                      ? "font-semibold"
                      : ""
                  }
                >
                  My Profile
                </span>
              </button>
            </Link>

            <Link
              to="/saved"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                location.pathname === "/saved" ||
                location.pathname === "/saved/"
                  ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaRegBookmark
                className={`text-lg ${
                  location.pathname === "/saved" ||
                  location.pathname === "/saved/"
                    ? "text-white"
                    : "text-gray-700"
                }`}
              />
              <span
                className={
                  location.pathname === "/saved" ||
                  location.pathname === "/saved/"
                    ? "font-semibold"
                    : ""
                }
              >
                Saved Polls
              </span>
            </Link>

            <Link
              to="/messages"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                location.pathname === "/messages" ||
                location.pathname === "/messages/"
                  ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiMessageCircle
                className={`text-xl ${location.pathname === "/messages" || location.pathname === "/messages/" ? "text-white" : "text-gray-700"}`}
              />
              <span
                className={
                  location.pathname === "/messages" ||
                  location.pathname === "/messages/"
                    ? "font-semibold"
                    : ""
                }
              >
                Messages
              </span>
            </Link>
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

      {/* Mobile bottom navigation - rendered via Portal to escape sticky stacking context */}
      {createPortal(
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md md:hidden">
          <div className="max-w-[480px] mx-auto flex items-center justify-around py-2">
            <Link to="/">
              <button
                className={`p-2 rounded-full ${
                  location.pathname === "/" ? "text-[#4a90e2]" : "text-gray-600"
                }`}
                aria-label="Home"
              >
                <GrHomeRounded className="text-2xl" />
              </button>
            </Link>

            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("openPostPoll"))
              }
              className="p-2 rounded-full text-gray-600"
              aria-label="Create Poll"
            >
              <IoMdAddCircleOutline className="text-3xl" />
            </button>

            <Link to="/user">
              <button
                className={`p-2 rounded-full ${
                  location.pathname === "/user" ||
                  location.pathname === "/user/"
                    ? "text-[#4a90e2]"
                    : "text-gray-600"
                }`}
                aria-label="My Profile"
              >
                <CgProfile className="text-2xl" />
              </button>
            </Link>

            <Link to="/saved">
              <button
                className={`p-2 rounded-full ${
                  location.pathname === "/saved" ||
                  location.pathname === "/saved/"
                    ? "text-[#4a90e2]"
                    : "text-gray-600"
                }`}
                aria-label="Saved Polls"
              >
                <FaRegBookmark className="text-2xl" />
              </button>
            </Link>

            <Link to="/messages">
              <button
                className={`p-2 rounded-full ${
                  location.pathname === "/messages" ||
                  location.pathname === "/messages/"
                    ? "text-[#4a90e2]"
                    : "text-gray-600"
                }`}
                aria-label="Messages"
              >
                <FiMessageCircle className="text-2xl" />
              </button>
            </Link>
          </div>
        </nav>,
        document.body,
      )}
    </>
  );
}

export default Sidebar;
