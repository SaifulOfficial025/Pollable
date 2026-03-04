import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

function Sidebar({ selected = "blocked", onSelect = () => {} }) {
  return (
    <div className="w-full max-w-xs">
      <div className="bg-gray-50 rounded-lg p-6">
        <Link to="/" className="block">
          <button className="inline-flex items-center gap-2 text-sm text-gray-600 mb-4 hover:text-gray-800 focus:outline-none">
            <BiArrowBack className="text-lg" />
            <span>Back</span>
          </button>
        </Link>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <button
            onClick={() => onSelect("account")}
            className={`w-full flex items-center justify-between py-3 px-2 text-left rounded-md ${selected === "account" ? "bg-transparent" : "hover:bg-gray-50"}`}
          >
            <span
              className={`${selected === "account" ? "font-semibold text-gray-800" : "text-gray-700"}`}
            >
              Account
            </span>
            <FiChevronRight className="text-gray-400" />
          </button>

          <button
            onClick={() => onSelect("password")}
            className={`w-full flex items-center justify-between py-3 px-2 text-left rounded-md mt-2 ${selected === "password" ? "bg-transparent" : "hover:bg-gray-50"}`}
          >
            <span
              className={`${selected === "password" ? "font-semibold text-gray-800" : "text-gray-700"}`}
            >
              Change Password
            </span>
            <FiChevronRight className="text-gray-400" />
          </button>

          <button
            onClick={() => onSelect("blocked")}
            className={`w-full flex items-center justify-between py-3 px-2 text-left rounded-md mt-2 ${selected === "blocked" ? "bg-transparent" : "hover:bg-gray-50"}`}
          >
            <span
              className={`${selected === "blocked" ? "font-semibold text-gray-800" : "text-gray-700"}`}
            >
              Blocked Users
            </span>
            <FiChevronRight className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
