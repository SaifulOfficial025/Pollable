import React, { useState } from "react";
import Button from "../../Shared/Button";

function Password() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleUpdate(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }
    // Placeholder: wire to API
    alert("Password updated (demo)");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 max-w-5xl">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Password &amp; Security
      </h3>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="text-xs text-gray-500">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-2 w-full bg-gray-50 border border-gray-100 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-2 w-full bg-gray-50 border border-gray-100 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 w-full bg-gray-50 border border-gray-100 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <Button label="Update Password" />
        </div>
      </form>
    </div>
  );
}

export default Password;
