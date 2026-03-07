import React from "react";

function ChooseTopicComponent({ topics, selectedTopics, toggleTopic }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="text-md font-semibold text-gray-800">Choose Topic(s)</h3>
      <p className="text-sm text-gray-400 mt-2">
        Add up to 3 topics to help others find your poll. We'll show it to the
        people who'll enjoy it most!
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {topics.map((topic) => (
          <button
            key={topic.name}
            onClick={() => toggleTopic(topic.name)}
            disabled={
              !selectedTopics.includes(topic.name) && selectedTopics.length >= 3
            }
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-opacity duration-200 ${
              selectedTopics.includes(topic.name)
                ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white shadow-sm"
                : "bg-gray-50 border border-gray-100 text-gray-700"
            } ${
              !selectedTopics.includes(topic.name) && selectedTopics.length >= 3
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <img
              src={topic.img}
              alt={topic.name}
              className="w-6 h-6 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/topics/default.jpg";
              }}
            />
            <span>{topic.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChooseTopicComponent;
