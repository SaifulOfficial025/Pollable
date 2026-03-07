import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoLockClosedOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";

import Button from "../../Shared/Button";
import { Link } from "react-router-dom";
function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: integrate real reset password logic
    console.log("New password set", { password, confirmPassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xl px-6 sm:px-10 py-10">
        {/* Back */}
        <Link to="/forget-password-email">
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-[#4a90e2] bg-[#eff6ff] py-1 px-2 rounded-md hover:underline mb-10"
          >
            <FaArrowLeft className="text-lg" />
            Back
          </button>
        </Link>

        <div className="flex flex-col items-center text-center">
          <img src="/Logo.png" alt="Pollable" className="h-14 mb-6" />

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Set a password
          </h1>
          <p className="text-sm text-gray-500 mb-8 max-w-md">
            Your previous password has been reseted. Please set a new password
            for your account.
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center gap-5"
          >
            {/* Create Password */}
            <div className="w-full max-w-md text-left">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Create Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400 text-lg">
                  <IoLockClosedOutline />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border border-gray-200 pl-11 pr-11 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Re-enter Password */}
            <div className="w-full max-w-md text-left">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Re-enter Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400 text-lg">
                  <IoLockClosedOutline />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full rounded-lg border border-gray-200 pl-11 pr-11 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="w-full max-w-md pt-4">
              <Link to="/signin">
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  className="rounded-lg"
                >
                  Set password
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
