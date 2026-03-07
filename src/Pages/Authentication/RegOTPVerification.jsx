import React, { useState, useRef } from "react";
import Button from "../../Shared/Button";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

function RegOTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const code = otp.join("");
    // TODO: integrate real OTP verification
    console.log("Verify OTP:", code);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xl px-6 sm:px-10 py-10">
        {/* Back */}
        <Link to="/signup">
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-[#4a90e2] bg-[#eff6ff] py-1 px-2 rounded-md hover:underline mb-10"
          >
            <FaArrowLeft className="text-lg" />
            Back
          </button>
        </Link>

        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <img src="/Logo.png" alt="Pollable" className="h-14 mb-6" />

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            OTP Verification
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Enter the code sent to:{" "}
            <span className="font-medium">+8801757976790</span>
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center"
          >
            <p className="text-sm font-medium text-gray-800 mb-4">Enter Code</p>

            <div className="flex gap-4 mb-5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-14 h-14 border border-[#e2e8f0] rounded-lg text-center text-2xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent"
                />
              ))}
            </div>

            <p className="text-xs text-gray-400 mb-3">00:120 Sec</p>
            <p className="text-xs text-gray-500 mb-8">
              Didn&apos;t receive a code?{" "}
              <button
                type="button"
                className="text-[#4a90e2] font-medium hover:underline"
              >
                Resend
              </button>
            </p>

            <div className="w-full max-w-md">
              <Link to="/">
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  className="rounded-lg"
                >
                  Verify
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegOTPVerification;
