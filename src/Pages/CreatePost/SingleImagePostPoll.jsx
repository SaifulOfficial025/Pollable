import React, { useEffect, useState, useRef } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoImage } from "react-icons/io5";
import Button from "../../Shared/Button";
import ChooseTopicComponent from "./ChooseTopicComponent";
import PollSettingsComponent from "./PollSettingsComponent";
import { Link } from "react-router-dom";
import uploadicon from "../../../public/uploadicon.svg";
import { API_BASE_URL } from "../../Redux/Config";

function SingleImagePostPoll({ isEmbedded = false }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["Option 1", "Option 2"]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [profileName, setProfileName] = useState("You");
  const [avatarUrl, setAvatarUrl] = useState("/dummyavatar.jpg");
  const [topics] = useState([
    {
      name: "Technology",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Entertainment",
      img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Sports",
      img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "News and Politics",
      img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Gaming",
      img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Fashion",
      img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Animals and Nature",
      img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Travel and Geography",
      img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Health and Wellness",
      img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Science and Education",
      img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Community",
      img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Lifestyle",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Art & Design",
      img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Food and Drink",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Business",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Humor",
      img: "https://images.unsplash.com/photo-1517638851339-a711cfcf3279?auto=format&fit=crop&q=80&w=800",
    },
  ]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [allowComments, setAllowComments] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("profileData");
    if (!cached) return;
    try {
      const parsed = JSON.parse(cached);
      if (parsed?.name || parsed?.username) {
        setProfileName(parsed.name || parsed.username || "You");
      }
      if (parsed?.image) {
        setAvatarUrl(
          parsed.image.startsWith("http")
            ? parsed.image
            : `${API_BASE_URL}${parsed.image}`,
        );
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  function addOption() {
    setOptions((s) => [...s, `Option ${s.length + 1}`]);
  }

  function updateOption(i, value) {
    setOptions((s) => s.map((o, idx) => (idx === i ? value : o)));
  }

  function toggleTopic(t) {
    setSelectedTopics((s) => {
      if (s.includes(t)) {
        return s.filter((x) => x !== t);
      } else if (s.length < 3) {
        return [...s, t];
      } else {
        return s;
      }
    });
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 sm:gap-6">
      {/* Left column (main) */}
      <div className="col-span-12 lg:col-span-8 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
          <h3 className="text-md font-semibold text-gray-800">Poll Details</h3>

          {/* Upload Photo Section */}
          <div className="mt-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  {/* <IoImage className="text-5xl text-blue-500 mb-2" /> */}
                  <img
                    src={uploadicon}
                    alt="Upload Icon"
                    className="w-28 h-28 mb-2"
                  />
                  {/* <span className="text-blue-600 font-medium text-sm">
                    Upload Photo
                  </span> */}
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="mt-4">
            <label className="text-md text-gray-600">Poll Question</label>
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to ask?"
                className="w-full mt-2 border border-gray-100 rounded-lg p-4 h-28 text-sm text-gray-700 bg-gray-50"
                maxLength={280}
              />
              <div className="absolute right-3 bottom-2 text-xs text-gray-400">
                {question.length}/280
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-md text-gray-600">Answer Options</label>
            <div className="space-y-3 mt-3">
              {options.map((opt, i) => (
                <input
                  key={i}
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  className="w-full bg-white border border-gray-100 rounded-full px-4 py-3 text-sm shadow-sm"
                />
              ))}
            </div>

            <button
              onClick={addOption}
              className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700 border border-gray-200 rounded-md px-3 py-1"
            >
              <IoAddCircleOutline className="text-lg" /> Add Option
            </button>
          </div>
        </div>

        <ChooseTopicComponent
          topics={topics}
          selectedTopics={selectedTopics}
          toggleTopic={toggleTopic}
        />

        <PollSettingsComponent
          allowComments={allowComments}
          setAllowComments={setAllowComments}
        />
      </div>

      {/* Right column (preview + tips + actions) */}
      <div className="col-span-12 lg:col-span-4 mt-4 lg:mt-0">
        <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4">
          <h4 className="text-md font-semibold text-gray-800">Preview</h4>
          <div className="mt-3 border border-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="text-sm font-semibold">{profileName}</div>
                <div className="text-xs text-gray-400">Just now</div>
              </div>
            </div>

            {uploadedImage && (
              <div className="mt-3 w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={uploadedImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="mt-4 font-semibold text-black">
              {question || "Your poll question will appear here..."}
            </div>

            <div className="mt-3 space-y-3">
              {options.map((o, i) => (
                <div
                  key={i}
                  className="rounded-md border border-gray-100 p-3 bg-white text-md text-black"
                >
                  {o}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-blue-50 rounded-md p-3 text-md text-gray-700">
            <div className="font-semibold text-blue-700">Publishing Tips</div>
            <ul className="mt-2 list-disc ml-5 text-sm text-gray-600 space-y-1">
              <li>Clear, concise questions get better engagement</li>
              <li>Provide balanced answer options</li>
              <li>Choose the right category for better reach</li>
              <li>Enable comments for deeper insights</li>
            </ul>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 bg-white">
              Save as Draft
            </button>
            <div>
              <Button label="Publish Poll" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleImagePostPoll;
