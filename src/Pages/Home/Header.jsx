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
import { fetchProfile } from "../../Redux/Auth/Profile";
import { API_BASE_URL } from "../../Redux/Config";
import Button from "../../Shared/Button";

function Header({ onSearch }) {
  const [open, setOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const menuRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const isAuthenticated = Boolean(
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken"),
  );

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      if (!token) {
        setProfile(null);
        return;
      }

      try {
        const response = await fetchProfile();
        const profileData = response?.data || null;
        setProfile(profileData);
        if (profileData) {
          localStorage.setItem("profileData", JSON.stringify(profileData));
        }
      } catch {
        const cached = localStorage.getItem("profileData");
        if (cached) {
          try {
            setProfile(JSON.parse(cached));
          } catch {
            setProfile(null);
          }
        }
      }
    };

    loadProfile();
  }, [isAuthenticated]);

  const menuItems = [
    { label: "Settings", Icon: CiSettings },
    { label: "Recent Activity", Icon: MdOutlineSettingsBackupRestore },
    { label: "Log out", Icon: IoIosLogOut },
  ];

  const navigate = useNavigate();
  const profileImageUrl = profile?.image
    ? profile.image.startsWith("http")
      ? profile.image
      : `${API_BASE_URL}${profile.image}`
    : "/dummyavatar.jpg";
  const profileName = profile?.name || profile?.username || "User";

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-16 py-3 flex items-center gap-6">
        {/* Logo */}
        <Link
          to="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("resetHomeFeed"));
            }
          }}
        >
          <div className="flex-shrink-0">
            <img
              src="/logoicon.png"
              alt="Logo icon"
              className="h-8 w-auto block md:hidden"
            />
            <img
              src="/Logo.png"
              alt="Logo"
              className="h-8 w-auto hidden md:block"
            />
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSearch?.(searchTerm);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setNotifyOpen(true)}
                className="relative p-2 rounded-md hover:bg-gray-50"
              >
                <IoMdNotificationsOutline className="text-xl text-gray-600" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white -translate-y-1/2 translate-x-1/2" />
              </button>

              <div className="flex items-center gap-2" ref={menuRef}>
                <img
                  src={profileImageUrl}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:block text-sm text-gray-700 max-w-[120px] truncate">
                  {profileName}
                </span>
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
                                localStorage.clear();
                                sessionStorage.clear();
                                navigate("/signin");
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
            </>
          ) : (
            <Button
              onClick={() => navigate("/signin")}
              size="md"
              className="px-5"
            >
              Log in
            </Button>
          )}
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
