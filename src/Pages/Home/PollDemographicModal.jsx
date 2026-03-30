import React, { useEffect, useMemo, useState } from "react";
import Button from "../../Shared/Button";
import { fetchPollDemographics } from "../../Redux/Polls/Demographics";

function PollDemographicModal({ pollId, initialOpen = true, onClose }) {
  const [open, setOpen] = useState(initialOpen);
  const [tab, setTab] = useState("Age");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demographics, setDemographics] = useState({
    total_votes: 0,
    age: [],
    gender: [],
    ethnicity: [],
  });

  useEffect(() => {
    if (!open || !pollId) return;

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPollDemographics(pollId);
        if (!cancelled) setDemographics(data);
      } catch (err) {
        if (!cancelled)
          setError(err?.message || "Failed to load poll demographics.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [open, pollId]);

  const tabKey = useMemo(
    () => ({ Age: "age", Gender: "gender", Ethnicity: "ethnicity" }),
    [],
  );

  const currentData = demographics[tabKey[tab]] || [];

  const formatPercent = (value) => {
    const num = Number(value) || 0;
    return Math.min(100, Math.max(0, num)).toFixed(1);
  };

  const handleRetry = () => {
    if (!pollId) return;
    setOpen(true);
    setError("");
    setLoading(true);
    fetchPollDemographics(pollId)
      .then((data) => setDemographics(data))
      .catch((err) =>
        setError(err?.message || "Failed to load poll demographics."),
      )
      .finally(() => setLoading(false));
  };

  function handleClose() {
    setOpen(false);
    if (onClose) onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-start justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Poll Demographics
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 rounded-full p-1"
            aria-label="Close demographics"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-3">
            {["Age", "Gender", "Ethnicity"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  tab === t
                    ? "bg-gray-900 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="font-semibold text-gray-800">
                {tab} Distribution
              </div>
              <div className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                {demographics.total_votes.toLocaleString()} votes
              </div>
            </div>

            {loading && (
              <div className="text-sm text-gray-500">
                Loading demographics...
              </div>
            )}

            {!loading && error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="text-red-700 font-semibold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && currentData.length === 0 && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                No data for this category yet.
              </div>
            )}

            {!loading && !error && currentData.length > 0 && (
              <div className="space-y-3">
                {currentData.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-medium">
                        {item.label}
                      </span>
                      <span className="text-gray-500">
                        {formatPercent(item.percentage)}%
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]"
                        style={{ width: `${formatPercent(item.percentage)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.count} votes
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Button label="Close" onClick={handleClose} fullWidth />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollDemographicModal;
