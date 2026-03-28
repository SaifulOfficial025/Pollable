import React, { useEffect, useRef, useState } from "react";
import Button from "../../Shared/Button";
import { fetchProfile, updateProfile } from "../../Redux/Auth/Profile";
import { API_BASE_URL } from "../../Redux/Config";

function Profile() {
  const [form, setForm] = useState({
    biodata: "",
    username: "",
    email: "",
    name: "",
    ethnicity: "",
    gender: "",
    date_of_birth: "",
    topics: [],
    image: null,
    imageUrl: "/dummyavatar.jpg",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setSubmitError("");

      try {
        const response = await fetchProfile();
        const data = response?.data || {};
        setForm((prev) => ({
          ...prev,
          biodata: data.biodata || "",
          username: data.username || "",
          email: data.email || "",
          name: data.name || "",
          ethnicity: data.ethnicity ? data.ethnicity.toLowerCase() : "",
          gender: data.gender ? data.gender.toLowerCase() : "",
          date_of_birth: data.date_of_birth || "",
          topics: Array.isArray(data.topics) ? data.topics : [],
          image: null,
          imageUrl: data.image
            ? data.image.startsWith("http")
              ? data.image
              : `${API_BASE_URL}${data.image}`
            : "/dummyavatar.jpg",
        }));
      } catch (error) {
        setSubmitError(error.message || "Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const saveProfile = async () => {
      setIsSaving(true);
      setSubmitMessage("");
      setSubmitError("");

      try {
        const payload = {
          date_of_birth: form.date_of_birth,
          gender: form.gender,
          ethnicity: form.ethnicity,
          biodata: form.biodata,
          topics: form.topics,
          email: form.email,
          name: form.name,
          image: form.image,
        };

        const response = await updateProfile(payload);
        const profileData = response?.data || null;

        if (profileData) {
          localStorage.setItem("profileData", JSON.stringify(profileData));
          setForm((prev) => ({
            ...prev,
            biodata: profileData.biodata || prev.biodata,
            username: profileData.username || prev.username,
            email: profileData.email || prev.email,
            name: profileData.name || prev.name,
            ethnicity: profileData.ethnicity
              ? profileData.ethnicity.toLowerCase()
              : prev.ethnicity,
            gender: profileData.gender
              ? profileData.gender.toLowerCase()
              : prev.gender,
            date_of_birth: profileData.date_of_birth || prev.date_of_birth,
            image: null,
            imageUrl: profileData.image
              ? profileData.image.startsWith("http")
                ? profileData.image
                : `${API_BASE_URL}${profileData.image}`
              : prev.imageUrl,
          }));
        }

        setSubmitMessage(response?.message || "Profile updated successfully.");
      } catch (error) {
        setSubmitError(error.message || "Failed to update profile.");
      } finally {
        setIsSaving(false);
      }
    };

    saveProfile();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
      imageUrl: URL.createObjectURL(file),
    }));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 text-sm text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
      {/* Avatar and change photo */}
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <img
          src={form.imageUrl}
          alt="Profile"
          className="w-28 h-28 sm:w-44 sm:h-44 rounded-full object-cover mb-3"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
          onClick={() => fileInputRef.current?.click()}
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
              value={form.biodata}
              onChange={handleChange("biodata")}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <span className="absolute bottom-2 right-4 text-xs text-gray-400">
              {`${form.biodata?.length || 0}/120`}
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
                onChange={handleChange("email")}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <input
                type="date"
                value={form.date_of_birth}
                onChange={handleChange("date_of_birth")}
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
                value={form.name}
                onChange={handleChange("name")}
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
                <option value="">Select Ethnicity</option>
                <option value="asian">Asian</option>
                <option value="black">Black</option>
                <option value="hispanic">Hispanic</option>
                <option value="white">White</option>
                <option value="other">Other</option>
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
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {submitMessage && (
          <p className="text-sm text-green-600">{submitMessage}</p>
        )}
        {submitError && <p className="text-sm text-red-600">{submitError}</p>}

        <div className="pt-2">
          <Button
            type="submit"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
