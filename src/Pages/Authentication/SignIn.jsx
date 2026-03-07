import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoPeopleOutline } from "react-icons/io5";
import Button from "../../Shared/Button";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberAccount: false,
    },
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    // TODO: integrate real auth
    console.log(data);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="min-h-screen flex bg-white max-w-7xl mx-auto rounded-lg shadow-lg overflow-hidden">
      {/* Left side - marketing copy */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-b from-[#f5f0ff] via-[#f2f7ff] to-[#ffeefe] relative overflow-hidden px-16 py-16">
        <div className="relative z-10 max-w-xl mt-28">
          <Link to="/">
            <div className="flex items-center gap-2 mb-10">
              <img src="/Logo.png" alt="Pollable" className="h-10" />
            </div>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
            Explore the things
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]">
              you love.
            </span>
          </h1>

          <p className="mt-4 text-sm md:text-base text-gray-500 max-w-md">
            Create polls, share opinions, and discover what the world thinks.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4a90e2] to-[#7c3bed] text-white">
                <FaArrowTrendUp className="text-lg" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm md:text-base">
                  Trending Topics
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  Discover what&apos;s popular
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ff9ad5] to-[#ff7bb0] text-white">
                <IoIosHeartEmpty className="text-lg" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm md:text-base">
                  Instant Votes
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  See results in real-time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ffb27a] to-[#ff7a7a] text-white">
                <IoPeopleOutline className="text-lg" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm md:text-base">
                  Community Driven
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  Join millions of voters
                </p>
              </div>
            </div>
          </div>
        </div>

        <img
          src="/autosideimage.svg"
          alt="Pollable illustration"
          className="absolute right-[-40px] bottom-0 w-[420px] xl:w-[480px] pointer-events-none select-none"
        />
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-16 py-10 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Welcome
            </h2>
            <p className="mt-2 text-sm text-gray-500">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email or Phone Number
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  className={`w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent ${
                    errors.email ? "border-red-400" : ""
                  }`}
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email format",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-2 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full rounded-lg border border-gray-200 px-4 py-3 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent ${
                    errors.password ? "border-red-400" : ""
                  }`}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#4a90e2] focus:ring-[#4a90e2]"
                  />
                  Remember Me
                </label>
                <Link to="/forget-password-email">
                  <button
                    type="button"
                    className="text-xs md:text-sm text-[#4a90e2] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button type="submit" fullWidth size="lg" className="rounded-lg">
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs md:text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link to="/signup">
              <button
                type="button"
                className="font-medium text-[#4a90e2] hover:underline"
              >
                Sign Up
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
