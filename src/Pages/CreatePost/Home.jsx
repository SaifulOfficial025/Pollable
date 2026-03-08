import React, { useState, useEffect } from "react";
import TextPostPoll from "./TextPostPoll";
import SingleImagePostPoll from "./SingleImagePostPoll";
import ImagePerPoll from "./ImagePerPoll";

function Home() {
  const [open, setOpen] = useState(false);
  const [pollType, setPollType] = useState("text"); // "text", "single-image", "image-per-option"

  // Listen for a global event so other UI (e.g. Sidebar) can open this modal
  useEffect(() => {
    function handleOpen() {
      setOpen(true);
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pollType"
                    className="w-4 h-4"
                    checked={pollType === "text"}
                    onChange={() => setPollType("text")}
                  />
                  <span className="text-sm font-medium">Only Text Poll</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pollType"
                    className="w-4 h-4"
                    checked={pollType === "single-image"}
                    onChange={() => setPollType("single-image")}
                  />
                  <span className="text-sm">Single Image Poll</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pollType"
                    className="w-4 h-4"
                    checked={pollType === "image-per-option"}
                    onChange={() => setPollType("image-per-option")}
                  />
                  <span className="text-sm">Image Per Option</span>
                </label>
              </div>
            </div>

            {/* Render the appropriate poll type component */}
            {pollType === "text" && <TextPostPoll isEmbedded={true} />}
            {pollType === "single-image" && (
              <SingleImagePostPoll isEmbedded={true} />
            )}
            {pollType === "image-per-option" && (
              <ImagePerPoll isEmbedded={true} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
