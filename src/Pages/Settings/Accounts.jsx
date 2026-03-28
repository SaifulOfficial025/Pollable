import React, { useState } from "react";
import Button from "../../Shared/Button";
import { deleteAccount } from "../../Redux/Auth/DeleteAccount";
import { useNavigate } from "react-router-dom";

function Accounts() {
  const [notifications, setNotifications] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const clearAuthStorage = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authResponse");
    localStorage.removeItem("profileData");
    localStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("accessToken");
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setError("");
    setIsDeleting(true);
    try {
      await deleteAccount();
      clearAuthStorage();
      navigate("/signin");
    } catch (err) {
      setError(err?.message || "Failed to delete account.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subscription */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Subscription
        </h3>

        <div className="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="w-full sm:w-auto">
            <div className="text-sm font-semibold text-gray-900">Free Plan</div>
            <div className="text-xs text-gray-500">
              Basic features and analytics
            </div>
          </div>

          <div className="w-full sm:w-auto sm:text-right">
            <Button label="Upgrade to Premium" />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      {/* <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-800">
              Notification Settings
            </div>
            <div className="text-xs text-gray-500">General Notification</div>
          </div>

          <button
            onClick={() => setNotifications((s) => !s)}
            className={`w-12 h-6 rounded-full p-1 ${notifications ? "bg-blue-500" : "bg-gray-200"}`}
            aria-pressed={notifications}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform ${notifications ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
        </div>
      </div> */}

      {/* Delete Account */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="w-full sm:w-auto">
            <div className="text-sm font-semibold text-gray-800">
              Delete Account
            </div>
            <div className="text-xs text-gray-500">
              Delete your account permanently?
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 rounded-md border border-red-200 text-sm text-red-500 hover:bg-red-50 w-full sm:w-auto text-center disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-2" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default Accounts;
