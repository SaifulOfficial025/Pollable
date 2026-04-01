import React, { useState, useEffect, useCallback } from "react";
import TextPostPoll from "./TextPostPoll";
import SingleImagePostPoll from "./SingleImagePostPoll";
import ImagePerPoll from "./ImagePerPoll";
import Button from "../../Shared/Button";

function Home() {
  const [open, setOpen] = useState(false);
  const [pollType, setPollType] = useState("text"); // "text", "single-image", "image-per-option"
  const [audience, setAudience] = useState("everyone"); // "everyone", "followers", "close-friends"
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [editData, setEditData] = useState(null); // Store poll data for editing
  const [successToast, setSuccessToast] = useState("");

  const mapAudienceForUI = useCallback((value) => {
    const normalized = String(value || "everyone")
      .toLowerCase()
      .trim();
    if (normalized === "only_following") return "followers";
    if (
      normalized === "only_me" ||
      normalized === "close_friends" ||
      normalized === "close-friends"
    ) {
      return "close-friends";
    }
    if (normalized === "followers") return "followers";
    if (normalized === "everyone") return "everyone";
    return "everyone";
  }, []);

  const applyPollData = useCallback(
    (data) => {
      if (!data) {
        setEditData(null);
        setPollType("text");
        setAudience("everyone");
        setIsAnonymous(false);
        return;
      }

      setEditData(data);

      const type = data.poll_type || data.type;
      if (type === "single_image") {
        setPollType("single-image");
      } else if (type === "multiple_images") {
        setPollType("image-per-option");
      } else if (type === "text_only") {
        setPollType("text");
      } else if (data.bannerImage || data.image_full_url || data.image) {
        setPollType("single-image");
      } else if (data.options && data.options[0]?.image) {
        setPollType("image-per-option");
      } else {
        setPollType("text");
      }

      setAudience(
        mapAudienceForUI(data.privacy || data.audience || "everyone"),
      );
      setIsAnonymous(Boolean(data.is_anonymous));
    },
    [mapAudienceForUI],
  );

  // Listen for a global event so other UI (e.g. Sidebar) can open this modal
  useEffect(() => {
    function handleOpen(event) {
      setOpen(true);
      // If event has detail (poll data for editing), store it
      if (event.detail) {
        applyPollData(event.detail);
      } else {
        // Reset for new poll
        applyPollData(null);
      }
    }
    window.addEventListener("openPostPoll", handleOpen);
    return () => window.removeEventListener("openPostPoll", handleOpen);
  }, [applyPollData]);

  const loadLastDraft = () => {
    try {
      const raw = localStorage.getItem("lastDraftPoll");
      if (!raw) {
        return alert("No draft found. Create and save a poll draft first.");
      }
      const parsed = JSON.parse(raw);
      setOpen(true);
      applyPollData(parsed);
    } catch (err) {
      // Fallback if parsing fails
      alert("Unable to load the last draft. Please try creating a new poll.");
    }
  };

  const handleComposerSuccess = useCallback((message, options = {}) => {
    const shouldReload = Boolean(options?.reloadPage);

    if (shouldReload) {
      localStorage.setItem(
        "postPollSuccessToast",
        message || "Poll updated successfully.",
      );
      window.location.reload();
      return;
    }

    setOpen(false);
    setSuccessToast(message || "Poll saved successfully.");
    setEditData(null);

    window.dispatchEvent(new Event("resetHomeFeed"));
  }, []);

  useEffect(() => {
    const pendingToast = localStorage.getItem("postPollSuccessToast");
    if (!pendingToast) return;
    setSuccessToast(pendingToast);
    localStorage.removeItem("postPollSuccessToast");
  }, []);

  useEffect(() => {
    if (!successToast) return;
    const timer = window.setTimeout(() => setSuccessToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [successToast]);

  return (
    <>
      {/* Modal / Expanded composer */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 pb-10 px-4 sm:px-6 overflow-y-auto">
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

            {/* <div className="mb-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Continue your last draft?
                  </h3>
                  <Button size="md" onClick={loadLastDraft} className="mb-2">
                    Load Last Draft
                  </Button>
                  <p className="text-xs text-gray-500">
                    Loads the most recent draft fetched from your account into
                    the composer for editing.
                  </p>
                </div>
              </div>
            </div> */}

            {/* Poll format choices */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Choose your poll format
              </h3>
              <div className="inline-flex flex-wrap gap-2 rounded-full bg-gray-50 p-1 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setPollType("text")}
                  className={`px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-colors ${
                    pollType === "text"
                      ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]  text-white shadow-sm"
                      : "bg-transparent text-gray-700 hover:bg-white"
                  }`}
                >
                  Only Text Poll
                </button>

                <button
                  type="button"
                  onClick={() => setPollType("single-image")}
                  className={`px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-colors ${
                    pollType === "single-image"
                      ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]  text-white shadow-sm"
                      : "bg-transparent text-gray-700 hover:bg-white"
                  }`}
                >
                  Single Image Poll
                </button>

                <button
                  type="button"
                  onClick={() => setPollType("image-per-option")}
                  className={`px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-colors ${
                    pollType === "image-per-option"
                      ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]  text-white shadow-sm"
                      : "bg-transparent text-gray-700 hover:bg-white"
                  }`}
                >
                  Image Per Option
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Audience
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Choose who can see and vote on this poll.
              </p>

              <div className="inline-flex flex-wrap gap-2 rounded-full bg-gray-50 p-1 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setAudience("everyone")}
                  className={`px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-colors ${
                    audience === "everyone"
                      ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]  text-white shadow-sm"
                      : "bg-transparent text-gray-700 hover:bg-white"
                  }`}
                >
                  Everyone
                </button>

                <button
                  type="button"
                  onClick={() => setAudience("followers")}
                  className={`px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-colors ${
                    audience === "followers"
                      ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]  text-white shadow-sm"
                      : "bg-transparent text-gray-700 hover:bg-white"
                  }`}
                >
                  Followers
                </button>

                <button
                  type="button"
                  onClick={() => setAudience("close-friends")}
                  className={`px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-colors ${
                    audience === "close-friends"
                      ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]  text-white shadow-sm"
                      : "bg-transparent text-gray-700 hover:bg-white"
                  }`}
                >
                  Only Me
                </button>
              </div>

              <p className="mt-2 text-[11px] text-gray-500">
                You can change this audience later when editing the poll.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Anonymous?
              </h3>
              {/* <p className="text-xs text-gray-500 mb-3">
                Choose who can see and vote on this poll.
              </p> */}

              <div className="inline-flex flex-wrap gap-2 rounded-full bg-gray-50 p-1 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAnonymous(true)}
                  className={`px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-colors ${
                    isAnonymous
                      ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]  text-white shadow-sm"
                      : "bg-transparent text-gray-700 hover:bg-white"
                  }`}
                >
                  Yes
                </button>

                <button
                  type="button"
                  onClick={() => setIsAnonymous(false)}
                  className={`px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-colors ${
                    !isAnonymous
                      ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]  text-white shadow-sm"
                      : "bg-transparent text-gray-700 hover:bg-white"
                  }`}
                >
                  No
                </button>

                {/* <button
                  type="button"
                  onClick={() => setAudience("close-friends")}
                  className={`px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-colors ${
                    audience === "close-friends"
                      ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]  text-white shadow-sm"
                      : "bg-transparent text-gray-700 hover:bg-white"
                  }`}
                >
                  Only Me
                </button> */}
              </div>

              <p className="mt-2 text-[11px] text-gray-500">
                You can change this later when editing the poll.
              </p>
            </div>

            {/* Render the appropriate poll type component */}
            {pollType === "text" && (
              <TextPostPoll
                isEmbedded={true}
                editData={editData}
                audience={audience}
                isAnonymous={isAnonymous}
                onSuccess={handleComposerSuccess}
              />
            )}
            {pollType === "single-image" && (
              <SingleImagePostPoll
                isEmbedded={true}
                editData={editData}
                audience={audience}
                isAnonymous={isAnonymous}
                onSuccess={handleComposerSuccess}
              />
            )}
            {pollType === "image-per-option" && (
              <ImagePerPoll
                isEmbedded={true}
                editData={editData}
                audience={audience}
                isAnonymous={isAnonymous}
                onSuccess={handleComposerSuccess}
              />
            )}
          </div>
        </div>
      )}

      {successToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-md bg-green-600 text-white text-sm shadow-lg">
          {successToast}
        </div>
      )}
    </>
  );
}

export default Home;
