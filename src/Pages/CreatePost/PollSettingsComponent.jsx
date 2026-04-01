import React from "react";

function PollSettingsComponent({
  allowComments,
  setAllowComments,
  durationHours = null,
  setDurationHours,
}) {
  const handleDurationChange = (e) => {
    if (!setDurationHours) return;
    const value = e.target.value;
    if (value === "") {
      setDurationHours(null);
    } else {
      setDurationHours(Number(value));
    }
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
      <h3 className="text-md font-semibold text-gray-800">Poll Settings</h3>
      <div className="mt-4 space-y-3">
        <div>
          <div className="text-md font-medium text-gray-900">Duration</div>
          <select
            value={durationHours === null ? "" : durationHours}
            onChange={handleDurationChange}
            className="mt-2 w-full sm:w-48 border border-gray-100 rounded-md px-3 py-2 text-md bg-white"
          >
            <option value="">No end date</option>
            <option value="12">12 Hours</option>
            <option value="24">1 day</option>
            <option value="168">7 days</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-md font-medium">Allow Comments</div>
            <div className="text-xs text-gray-400">
              Let people discuss this poll
            </div>
          </div>
          <button
            onClick={() => setAllowComments((s) => !s)}
            className={`w-12 h-6 rounded-full p-1 ${
              allowComments ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform ${
                allowComments ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PollSettingsComponent;
