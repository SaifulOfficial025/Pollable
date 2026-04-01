import React, { useEffect, useState } from "react";
import PollCard from "./PollCard";
import Header from "./Header";
import Sidebar from "./Sidebar";
import RightBar from "./RightBar";
import PollCardWithOneImage from "./PollCardWithOneImage";
import PollCardwithMultiImage from "./PollCardwithMultiImage";
import { createPollsSocket, normalizePoll } from "../../Redux/Polls/FetchPolls";

function DraftPolls() {
  const [draftPolls, setDraftPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const extractDrafts = (payload) => {
    const draftCandidates = [
      payload?.data?.drafts,
      payload?.drafts,
      payload?.data?.draft_polls,
      payload?.draft_polls,
      payload?.data?.results,
      payload?.data?.polls,
      payload?.results,
      payload?.polls,
      payload?.data,
    ];

    return draftCandidates.find((c) => Array.isArray(c)) || null;
  };

  const viewDraftPoll = (poll) => {
    if (!poll) return;
    setDraftPolls([poll]);
  };

  useEffect(() => {
    let closed = false;

    let socketInstance;
    try {
      socketInstance = createPollsSocket({
        onOpen: () => {
          setError("");
          setIsLoading(true);
          socketInstance.sendGetMyDrafts({ limit: 20, offset: 0 });
        },
        onMessage: (payload) => {
          const rawDrafts = extractDrafts(payload);
          if (!rawDrafts) return;

          const normalized = rawDrafts
            .map((p) => normalizePoll(p))
            .filter(Boolean);
          setDraftPolls(normalized);
          setIsLoading(false);
        },
        onError: () => {
          if (!closed) {
            setError("Unable to load draft polls.");
            setIsLoading(false);
          }
        },
        onClose: () => {
          if (!closed) setIsLoading(false);
        },
      });

      // Safe to call immediately: helper queues while socket is connecting.
      socketInstance.sendGetMyDrafts({ limit: 20, offset: 0 });
    } catch (err) {
      setError(err?.message || "Unable to load draft polls.");
      setIsLoading(false);
      return;
    }

    return () => {
      closed = true;
      socketInstance?.close?.();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-16 mt-6 max-w-[1536px]">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-2">
            <div className="sticky top-24">
              <Sidebar
                savedDrafts={draftPolls}
                onSelectSavedDraft={viewDraftPoll}
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 pb-24 md:pb-16">
            <h2 className="text-2xl font-bold text-gray-900">Draft Polls</h2>

            {isLoading && (
              <div className="text-sm text-gray-500">
                Loading draft polls...
              </div>
            )}

            {error && <div className="text-sm text-red-500">{error}</div>}

            {!isLoading && !error && draftPolls.length === 0 && (
              <div className="text-sm text-gray-500">No draft polls found.</div>
            )}

            {draftPolls.map((poll, idx) => {
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

export default DraftPolls;
