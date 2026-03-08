import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import {
  MdOutlineSettingsBackupRestore,
  MdOutlineEventNote,
  MdOutlinePrivacyTip,
} from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { Link } from "react-router-dom";
import NotificationModal from "./NotificationModal";

function Header() {
  const [open, setOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const menuItems = [
    { label: "Settings", Icon: CiSettings },
    { label: "Recent Activity", Icon: MdOutlineSettingsBackupRestore },
    { label: "Log out", Icon: IoIosLogOut },
  ];

  const navigate = useNavigate();

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-9xl mx-auto px-16 py-3 flex items-center gap-6">
        {/* Logo */}
        <Link to="/">
          <div className="flex-shrink-0">
            <img src="/Logo.png" alt="Logo" className="h-8 w-auto" />
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1">
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <IoSearchOutline className="text-lg" />
              </span>
              <input
                type="text"
                placeholder="Search polls, topics, or people..."
                className="w-full rounded-full bg-gray-50 border border-gray-300 focus:border-gray-200 focus:ring-0 pl-11 pr-4 py-2 text-sm text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setNotifyOpen(true)}
            className="relative p-2 rounded-md hover:bg-gray-50"
          >
            <IoMdNotificationsOutline className="text-xl text-gray-600" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white -translate-y-1/2 translate-x-1/2" />
          </button>

          <div className="flex items-center gap-2" ref={menuRef}>
            <img
              src="/dummyavatar.jpg"
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <button
              onClick={() => setOpen((s) => !s)}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
              aria-haspopup="true"
              aria-expanded={open}
            >
              <MdOutlineKeyboardArrowDown className="text-lg" />
            </button>

            {open && (
              <div className="absolute right-4 top-16 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <ul className="py-2">
                  {menuItems.map(({ label, Icon }, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                      onClick={() => {
                        setOpen(false);
                        switch (label) {
                          case "Settings":
                            navigate("/settings");
                            break;
                          case "Recent Activity":
                            navigate("/activity");
                            break;
                          case "Log out":
                            navigate("/logout");
                            break;
                          default:
                            break;
                        }
                      }}
                    >
                      <Icon className="text-lg text-gray-500" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {notifyOpen && (
          <NotificationModal
            initialOpen={true}
            onClose={() => setNotifyOpen(false)}
          />
        )}
      </div>
    </header>
  );
}

export default Header;
