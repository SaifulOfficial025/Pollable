import React, { useEffect, useState } from "react";
import PollCard from "./PollCard";
import Header from "./Header";
import Sidebar from "./Sidebar";
import RightBar from "./RightBar";
import PollCardWithOneImage from "./PollCardWithOneImage";
import PollCardwithMultiImage from "./PollCardwithMultiImage";
import { fetchSavedPolls } from "../../Redux/Polls/SavedPolls";

function SavedPoll() {
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const viewSavedDraft = (poll) => {
    if (!poll) return;
    setSavedDrafts([poll]);
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await fetchSavedPolls();
        if (!cancelled) setSavedDrafts(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Unable to load saved polls.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 ">
        <Header />
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-16 mt-6 max-w-[1536px]">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Sticky */}
          <div className="col-span-12 lg:col-span-2">
            <div className="sticky top-24">
              <Sidebar
                savedDrafts={savedDrafts}
                onSelectSavedDraft={viewSavedDraft}
              />
            </div>
          </div>

          {/* Main content - Scrollable */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 pb-24 md:pb-16">
            <h2 className="text-2xl font-bold text-gray-900">Saved Polls</h2>

            {isLoading && (
              <div className="text-sm text-gray-500">
                Loading saved polls...
              </div>
            )}

            {error && <div className="text-sm text-red-500">{error}</div>}

            {!isLoading && !error && savedDrafts.length === 0 && (
              <div className="text-sm text-gray-500">No saved polls yet.</div>
            )}

            {savedDrafts.map((poll, idx) => {
              const type = poll.poll_type || poll.type;
              const key = poll.id || idx;

              return (
                <div key={key}>
                  {type === "single_image" ? (
                    <PollCardWithOneImage pollData={poll} />
                  ) : type === "multiple_images" ? (
                    <PollCardwithMultiImage pollData={poll} />
                  ) : (
                    <PollCard pollData={poll} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right bar - Sticky */}
          <div className="col-span-12 lg:col-span-3 pb-20 md:pb-0">
            <div className="sticky top-24">
              <RightBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedPoll;
