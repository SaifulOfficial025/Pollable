import React, { useState, useEffect } from "react";
import TextPostPoll from "./TextPostPoll";
import SingleImagePostPoll from "./SingleImagePostPoll";
import ImagePerPoll from "./ImagePerPoll";

function Home() {
  const [open, setOpen] = useState(false);
  const [pollType, setPollType] = useState("text"); // "text", "single-image", "image-per-option"
  const [audience, setAudience] = useState("everyone"); // "everyone", "followers", "close-friends"
  const [editData, setEditData] = useState(null); // Store poll data for editing

  // Listen for a global event so other UI (e.g. Sidebar) can open this modal
  useEffect(() => {
    function handleOpen(event) {
      setOpen(true);
      // If event has detail (poll data for editing), store it
      if (event.detail) {
        setEditData(event.detail);
        // Set poll type and audience based on the poll data
        // You can customize this based on your poll data structure
        if (event.detail.bannerImage) {
          setPollType("single-image");
        } else if (event.detail.options && event.detail.options[0]?.image) {
          setPollType("image-per-option");
        } else {
          setPollType("text");
        }
        // Set audience if available in poll data
        if (event.detail.audience) {
          setAudience(event.detail.audience);
        }
      } else {
        // Reset for new poll
        setEditData(null);
        setPollType("text");
        setAudience("everyone");
      }
    }
    window.addEventListener("openPostPoll", handleOpen);
    return () => window.removeEventListener("openPostPoll", handleOpen);
  }, []);

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

            {/* Render the appropriate poll type component */}
            {pollType === "text" && (
              <TextPostPoll isEmbedded={true} editData={editData} />
            )}
            {pollType === "single-image" && (
              <SingleImagePostPoll isEmbedded={true} editData={editData} />
            )}
            {pollType === "image-per-option" && (
              <ImagePerPoll isEmbedded={true} editData={editData} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
