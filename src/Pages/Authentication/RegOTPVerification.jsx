import React, { useEffect, useRef, useState } from "react";
import Button from "../../Shared/Button";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../Redux/Auth/OTP";
import { saveSignInData } from "../../Redux/Auth/Signin";

function RegOTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const [phone, setPhone] = useState(() => {
    const fromNav = location.state?.phone;
    if (fromNav) return fromNav;

    const cached = localStorage.getItem("pendingRegistration");
    if (!cached) return "";
    try {
      const parsed = JSON.parse(cached);
      return parsed?.phone || "";
    } catch {
      return "";
    }
  });

  const [submitError, setSubmitError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(120);

  const formattedTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

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
    setSubmitError("");
    setInfoMessage("");
    const code = otp.join("");

    if (!phone) {
      setSubmitError("Missing phone number. Please sign up again.");
      return;
    }

    if (code.length < 6) {
      setSubmitError("Enter the 6-digit code.");
      return;
    }

    setIsLoading(true);
    verifyOtp({ phone, otp: code })
      .then((response) => {
        saveSignInData(response);
        localStorage.removeItem("pendingRegistration");
        navigate("/");
      })
      .catch((error) => {
        setSubmitError(error?.message || "Verification failed. Try again.");
      })
      .finally(() => setIsLoading(false));
  };

  const handleResend = () => {
    if (!phone || resendLoading || timer > 0) return;

    setSubmitError("");
    setInfoMessage("");
    setResendLoading(true);
    resendOtp({ phone })
      .then((response) => {
        setInfoMessage(response?.message || "OTP sent again.");
        setTimer(120);
      })
      .catch((error) => {
        setSubmitError(error?.message || "Unable to resend code.");
      })
      .finally(() => setResendLoading(false));
  };

  useEffect(() => {
    if (timer <= 0) return undefined;
    const id = setInterval(() => setTimer((t) => Math.max(t - 1, 0)), 1000);
    return () => clearInterval(id);
  }, [timer]);

  useEffect(() => {
    // If no phone is available, send user back to signup.
    if (!phone) {
      navigate("/signup");
    }
  }, [phone, navigate]);

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
            <span className="font-medium">{phone || "N/A"}</span>
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

            <p className="text-xs text-gray-400 mb-3">
              {timer > 0
                ? `Resend available in ${formattedTimer()}`
                : "You can resend now"}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Didn&apos;t receive a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0 || resendLoading}
                className="text-[#4a90e2] font-medium hover:underline disabled:opacity-60"
              >
                {resendLoading ? "Resending..." : "Resend"}
              </button>
            </p>

            {submitError && (
              <p className="text-sm text-red-500 mb-2">{submitError}</p>
            )}
            {infoMessage && (
              <p className="text-sm text-green-600 mb-2">{infoMessage}</p>
            )}

            <div className="w-full max-w-md">
              <Button
                type="submit"
                fullWidth
                size="lg"
                className="rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegOTPVerification;
