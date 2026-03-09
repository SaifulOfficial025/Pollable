import React, { useState } from "react";
import Button from "../../Shared/Button";

function Profile() {
  const [form, setForm] = useState({
    bio: "Passionate about data-driven insights and meaningful conversations.",
    username: "ahmadjubayerr",
    email: "ahmadjubayerr@gmail.com",
    fullName: "Jubayer Ahmad",
    ethnicity: "Asian",
    gender: "Male",
    birthDate: "2000-01-01",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just log the values
    console.log("Profile updated", form);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
      {/* Avatar and change photo */}
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <img
          src="/dummyavatar.jpg"
          alt="Profile"
          className="w-28 h-28 sm:w-44 sm:h-44 rounded-full object-cover mb-3"
        />
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          Change Photo
        </button>
        <p className="mt-2 text-xs text-gray-500">
          JPG, PNG or GIF. Max size 2MB.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={form.bio}
              onChange={handleChange("bio")}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <span className="absolute bottom-2 right-4 text-xs text-gray-400">
              0/120
            </span>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <input
                type="date"
                value={form.birthDate}
                onChange={handleChange("birthDate")}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={handleChange("fullName")}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ethnicity
              </label>
              <select
                value={form.ethnicity}
                onChange={handleChange("ethnicity")}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Asian">Asian</option>
                <option value="Black">Black</option>
                <option value="Hispanic">Hispanic</option>
                <option value="White">White</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={handleChange("gender")}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
