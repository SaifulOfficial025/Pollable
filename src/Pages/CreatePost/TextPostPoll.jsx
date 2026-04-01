import React, { useEffect, useRef, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import Button from "../../Shared/Button";
import ChooseTopicComponent from "./ChooseTopicComponent";
import PollSettingsComponent from "./PollSettingsComponent";
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

function TextPostPoll({
  isEmbedded = false,
  audience = "everyone",
  isAnonymous = false,
  editData = null,
  onSuccess,
}) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [allowComments, setAllowComments] = useState(true);
  const [profileName, setProfileName] = useState("You");
  const [avatarUrl, setAvatarUrl] = useState("/dummyavatar.jpg");
  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [durationHours, setDurationHours] = useState(24);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const topicsFetchedRef = useRef(false);

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
        return s; // Do not add more than 3
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
      .map((title) => ({ title, image: null }));

    if (optionPayload.length < 2) {
      setSubmitError("Please provide at least two options.");
      return;
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
      image: null,
    };

    setIsSubmitting(true);
    try {
      if (editData?.id) {
        await updatePoll(editData.id, payload);
        setSubmitMessage("Poll updated.");
        onSuccess?.(
          isDraft
            ? "Draft updated successfully."
            : "Poll updated successfully.",
          { reloadPage: true },
        );
      } else {
        await createPoll(payload);
        setSubmitMessage(isDraft ? "Draft saved." : "Poll published.");
        onSuccess?.(
          isDraft
            ? "Draft saved successfully."
            : "Poll published successfully.",
        );
      }
      if (!isDraft) {
        setQuestion("");
        setOptions(["", ""]);
        setHashtags([]);
        setSelectedTopics([]);
      }
    } catch (err) {
      setSubmitError(err.message || "Failed to create poll.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Listen for a global event so other UI (e.g. Sidebar) can open this modal
  React.useEffect(() => {
    if (!isEmbedded) {
      function handleOpen() {
        setOpen(true);
      }
      window.addEventListener("openPostPoll", handleOpen);
      return () => window.removeEventListener("openPostPoll", handleOpen);
    }
  }, [isEmbedded]);

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
      // ignore malformed cached data
    }
  }, []);

  useEffect(() => {
    if (!editData) {
      setQuestion("");
      setOptions(["", ""]);
      setSelectedTopics([]);
      setHashtags([]);
      setAllowComments(true);
      setDurationHours(24);
      return;
    }

    setQuestion(editData.title || editData.question || "");

    const incomingOptions = Array.isArray(editData.options)
      ? editData.options
          .map((o) => o?.title || o?.label || o?.text || "")
          .filter(Boolean)
      : [];
    setOptions(incomingOptions.length >= 2 ? incomingOptions : ["", ""]);

    const topicIds = Array.isArray(editData.topics)
      ? editData.topics
          .map((t) => (typeof t === "object" ? (t.id ?? t.topic_id) : t))
          .filter((id) => id !== null && id !== undefined)
      : [];
    setSelectedTopics(topicIds.slice(0, 3));

    const tagTitles = Array.isArray(editData.tags)
      ? editData.tags
          .map((t) => (typeof t === "object" ? t.title || t.name : t))
          .filter(Boolean)
      : [];
    setHashtags(tagTitles.slice(0, 5));

    setAllowComments(Boolean(editData.allow_comment));
    setDurationHours(
      editData.duration === 0 ? null : Number(editData.duration || 24),
    );
  }, [editData]);

  // If embedded, just render the content without modal
  if (isEmbedded) {
    return (
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        {/* Left column (main) */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
            <h3 className="text-md font-semibold text-gray-800">
              Poll Details
            </h3>
            <div className="mt-4">
              <label className="text-md text-gray-600">
                Write Poll Question
              </label>
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
                <h3 className="text-md font-semibold text-gray-800">
                  Hashtags
                </h3>
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
                  label={isSubmitting ? "Publishing..." : "Publish Poll"}
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

  return (
    <div>
      {/* Collapsed composer */}
      {!open && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 flex-1">
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <button
                onClick={() => setOpen(true)}
                className="flex-1 text-left bg-gray-50 border border-gray-200 rounded-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-500"
              >
                What's on your mind? Create a poll...
              </button>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="mt-3 sm:mt-0 ml-0 sm:ml-2 bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white px-4 py-2.5 sm:px-3 sm:py-3 rounded-lg flex items-center justify-center w-full sm:w-auto"
            >
              <IoAddCircleOutline className="text-xl sm:text-2xl " />
            </button>
          </div>
        </div>
      )}

      {/* Modal / Expanded composer */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 sm:px-6 py-6">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-10 w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
            {/* Close (X) button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>

            <div className="grid grid-cols-12 gap-4 sm:gap-6">
              {/* Left column (main) */}
              <div className="col-span-12 lg:col-span-8 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
                  <h3 className="text-md font-semibold text-gray-800">
                    Poll Details
                  </h3>
                  <div className="mt-4">
                    <label className="text-md text-gray-600">
                      Write Poll Question
                    </label>
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
                    <label className="text-md text-gray-600">
                      Answer Options
                    </label>
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
                  <p className="text-xs text-gray-400 mt-1">
                    Loading topics...
                  </p>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">
                        Hashtags
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Add up to 5 hashtags to improve discoverability
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {hashtags.length}/5
                    </div>
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
                  <h4 className="text-md font-semibold text-gray-800">
                    Preview
                  </h4>
                  <div className="mt-3 border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="text-sm font-semibold">
                          {profileName}
                        </div>
                        <div className="text-xs text-gray-400">Just now</div>
                      </div>
                    </div>

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
                    <div className="font-semibold text-blue-700">
                      Publishing Tips
                    </div>
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
                        label={isSubmitting ? "Publishing..." : "Publish Poll"}
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
          </div>
        </div>
      )}
    </div>
  );
}

export default TextPostPoll;
