import React, { useState } from "react";
import Button from "../../Shared/Button";

function PollDemographicModal({ initialOpen = true, onClose }) {
  const [open, setOpen] = useState(initialOpen);
  const [tab, setTab] = useState("Age");

  const ageData = [
    { label: "Under 18", percent: 30, votes: 320 },
    { label: "18-24", percent: 10, votes: 120 },
    { label: "25-34", percent: 57, votes: 610 },
    { label: "35-44", percent: 15, votes: 160 },
    { label: "45-54", percent: 10, votes: 110 },
    { label: "55-64", percent: 20, votes: 210 },
    { label: "65+", percent: 10, votes: 100 },
  ];

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
          <div className="flex gap-3">
            {["Age", "Gender", "Ethnicity"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${tab === t ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white" : "bg-gray-100 text-gray-700"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === "Age" && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-4">
                  Age Distribution
                </h4>

                <div className="space-y-4">
                  {ageData.map((a) => (
                    <div key={a.label} className="flex items-center gap-4">
                      <div className="w-36 text-sm text-gray-600">
                        {a.label}
                      </div>

                      <div className="flex-1">
                        <div className="w-full bg-blue-50 rounded-full h-3 relative">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]"
                            style={{ width: `${a.percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="w-20 text-right text-sm text-gray-500">
                        <div>{a.percent}%</div>
                        <div className="text-xs text-gray-400">
                          {a.votes} votes
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab !== "Age" && (
              <div className="text-sm text-gray-600">
                No data for {tab} in this demo.
              </div>
            )}
          </div>

          <div className="mt-6">
            <Button label="Close" onClick={handleClose} fullWidth />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollDemographicModal;
