import React, { useEffect, useRef, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoImage } from "react-icons/io5";
import Button from "../../Shared/Button";
import ChooseTopicComponent from "./ChooseTopicComponent";
import PollSettingsComponent from "./PollSettingsComponent";
import uploadicon from "../../../public/uploadicon.svg";
import { API_BASE_URL } from "../../Redux/Config";
import {
  createPoll,
  fetchTopics,
  getCachedTopics,
} from "../../Redux/Polls/CreatingPoll";
import { updatePoll } from "../../Redux/Polls/EditPolls";

const FALLBACK_TOPICS = [
  {
    id: 1,
    title: "Technology",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Entertainment",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "News and Politics",
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Gaming",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "Fashion",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 7,
    title: "Animals and Nature",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 8,
    title: "Travel and Geography",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800",
  },
];

function SingleImagePostPoll({
  isEmbedded = false,
  editData = null,
  audience = "everyone",
  isAnonymous = false,
  onSuccess,
}) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [profileName, setProfileName] = useState("You");
  const [avatarUrl, setAvatarUrl] = useState("/dummyavatar.jpg");
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [allowComments, setAllowComments] = useState(true);
  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [durationHours, setDurationHours] = useState(24);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const topicsFetchedRef = useRef(false);

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

  useEffect(() => {
    let isMounted = true;

    if (topicsFetchedRef.current) return;
    topicsFetchedRef.current = true;

    const cached = getCachedTopics();
    if (cached?.length) {
      setTopics(cached);
      setTopicsLoading(false);
      return;
    }

    const loadTopics = async () => {
      setTopicsLoading(true);
      try {
        const data = await fetchTopics();
        if (isMounted) setTopics(data);
      } catch {
        if (isMounted) setTopics(FALLBACK_TOPICS);
      } finally {
        if (isMounted) setTopicsLoading(false);
      }
    };

    loadTopics();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!editData) {
      setQuestion("");
      setOptions(["", ""]);
      setSelectedTopics([]);
      setHashtags([]);
      setAllowComments(true);
      setDurationHours(24);
      setUploadedImage(null);
      setUploadedFile(null);
      return;
    }

    setQuestion(editData.title || "");

    const nextOptions = (
      Array.isArray(editData.options) ? editData.options : []
    )
      .map((o) => o?.title || "")
      .filter(Boolean);
    setOptions(nextOptions.length >= 2 ? nextOptions : ["", ""]);

    const topicIds = Array.isArray(editData.topics)
      ? editData.topics
          .map((t) => (typeof t === "object" ? t.id : t))
          .filter((t) => t !== null && t !== undefined)
      : [];
    setSelectedTopics(topicIds);

    const nextTags = Array.isArray(editData.tags)
      ? editData.tags
          .map((tag) => {
            if (typeof tag === "string") return tag;
            return tag?.name || tag?.title || "";
          })
          .filter(Boolean)
      : [];
    setHashtags(nextTags);

    setAllowComments(
      typeof editData.allow_comment === "boolean"
        ? editData.allow_comment
        : true,
    );
    setDurationHours(
      editData.duration !== null && editData.duration !== undefined
        ? Number(editData.duration)
        : 24,
    );

    const existingImage =
      editData.image_full_url ||
      editData.image_url ||
      editData.image ||
      editData.bannerImage ||
      null;
    setUploadedImage(existingImage);
    setUploadedFile(null);
  }, [editData]);

  function addOption() {
    setOptions((s) => [...s, ""]);
  }

  function removeOption(i) {
    setOptions((s) => {
      if (s.length <= 2) return s;
      return s.filter((_, idx) => idx !== i);
    });
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

  function addHashtag() {
    const trimmed = hashtagInput.trim();
    if (!trimmed) return;
    if (hashtags.length >= 5) return;
    if (hashtags.some((tag) => tag.toLowerCase() === trimmed.toLowerCase())) {
      setHashtagInput("");
      return;
    }
    setHashtags((s) => [...s, trimmed]);
    setHashtagInput("");
  }

  function removeHashtag(tag) {
    setHashtags((s) => s.filter((t) => t !== tag));
  }

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        resolve(typeof result === "string" ? result : "");
      };
      reader.onerror = () => reject(new Error("Unable to read file"));
      reader.readAsDataURL(file);
    });

  function resetSubmitState() {
    setSubmitError("");
    setSubmitMessage("");
  }

  async function handleSubmit(isDraft = false) {
    resetSubmitState();

    const questionText = question.trim();
    if (!questionText) {
      setSubmitError("Please enter a question before publishing.");
      return;
    }

    const optionPayload = options
      .map((t) => t.trim())
      .filter(Boolean)
      .map((title) => ({ title }));

    if (optionPayload.length < 2) {
      setSubmitError("Please provide at least two options.");
      return;
    }

    let imageBase64 = null;
    if (uploadedFile) {
      try {
        imageBase64 = await fileToBase64(uploadedFile);
      } catch {
        setSubmitError("Unable to read the image file.");
        return;
      }
    }

    const payload = {
      title: questionText,
      duration: durationHours === null ? 0 : Number(durationHours),
      allow_comment: allowComments,
      privacy: audience,
      is_anonymous: Boolean(isAnonymous),
      is_draft: Boolean(isDraft),
      options: optionPayload,
      topics: selectedTopics,
      tags: hashtags,
      image: imageBase64,
    };

    setIsSubmitting(true);
    try {
      if (editData?.id) {
        await updatePoll(editData.id, payload);
      } else {
        await createPoll(payload);
      }
      setSubmitMessage(
        editData?.id
          ? isDraft
            ? "Draft updated."
            : "Poll updated."
          : isDraft
            ? "Draft saved."
            : "Poll published.",
      );
      onSuccess?.(
        editData?.id
          ? isDraft
            ? "Draft updated successfully."
            : "Poll updated successfully."
          : isDraft
            ? "Draft saved successfully."
            : "Poll published successfully.",
        { reloadPage: Boolean(editData?.id) },
      );
      if (!isDraft) {
        setQuestion("");
        setOptions(["", ""]);
        setHashtags([]);
        setSelectedTopics([]);
        setUploadedImage(null);
        setUploadedFile(null);
      }
    } catch (err) {
      setSubmitError(err.message || "Failed to save poll.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setUploadedFile(file);
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
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="w-full bg-white border border-gray-100 rounded-full px-4 py-3 text-sm shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    disabled={options.length <= 2}
                    className="w-9 h-9 rounded-full border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={`Remove option ${i + 1}`}
                  >
                    &times;
                  </button>
                </div>
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
        {topicsLoading && !topics.length && (
          <p className="text-xs text-gray-400 mt-1">Loading topics...</p>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-semibold text-gray-800">Hashtags</h3>
              <p className="text-sm text-gray-500 mt-1">
                Add up to 5 hashtags to improve discoverability
              </p>
            </div>
            <div className="text-xs text-gray-400">{hashtags.length}/5</div>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addHashtag();
                }
              }}
              placeholder="#addhashtag"
              className="flex-1 bg-gray-50 border border-gray-100 rounded-full px-4 py-2.5 text-sm"
            />
            <button
              onClick={addHashtag}
              className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 bg-white"
            >
              Add
            </button>
          </div>

          {hashtags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  #{tag}
                  <button
                    onClick={() => removeHashtag(tag)}
                    className="text-blue-500 hover:text-blue-700"
                    aria-label={`Remove ${tag}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <PollSettingsComponent
          allowComments={allowComments}
          setAllowComments={setAllowComments}
          durationHours={durationHours}
          setDurationHours={setDurationHours}
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
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 bg-white disabled:opacity-60"
            >
              Save as Draft
            </button>
            <div>
              <Button
                label={
                  isSubmitting
                    ? editData?.id
                      ? "Saving..."
                      : "Publishing..."
                    : editData?.id
                      ? "Save Changes"
                      : "Publish Poll"
                }
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {(submitError || submitMessage) && (
            <div
              className={`mt-2 text-sm ${
                submitError ? "text-red-600" : "text-green-600"
              }`}
            >
              {submitError || submitMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleImagePostPoll;
