import React, { useState } from "react";
import Button from "../../Shared/Button";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function ForgetPasswordEmail() {
  const [identifier, setIdentifier] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: integrate real send-OTP logic
    console.log("Send OTP to:", identifier);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xl px-6 sm:px-10 py-10">
        {/* Back */}
        <Link to="/sign-in">
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
            Forgot your password?
          </h1>
          <p className="text-sm text-gray-500 mb-8 max-w-md">
            Don&apos;t worry, happens to all of us. Enter your email below to
            recover your password
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center gap-5"
          >
            <div className="w-full max-w-md text-left">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Email or Phone Number
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent"
                placeholder="Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div className="w-full max-w-md pt-2">
              <Link to="/forget-password-otp-verification">
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  className="rounded-lg"
                >
                  Send OTP
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgetPasswordEmail;
