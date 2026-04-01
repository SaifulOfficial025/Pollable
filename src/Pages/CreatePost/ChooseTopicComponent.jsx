import React from "react";

function ChooseTopicComponent({ topics, selectedTopics, toggleTopic }) {
  const resolveId = (topic) =>
    topic.id ?? topic.topic_id ?? topic.name ?? topic.title ?? null;
  const resolveTitle = (topic) => topic.title || topic.name || "Topic";
  const resolveImage = (topic) =>
    topic.image || topic.image_full_url || topic.img || "";
  const fallbackImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><rect width='100%25' height='100%25' rx='16' fill='%23e5e7eb'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%236b7280'>#</text></svg>";
  const [failedImages, setFailedImages] = React.useState({});

  const markFailed = (id) => {
    setFailedImages((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: true };
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
      <h3 className="text-md font-semibold text-gray-800">Choose Topic(s)</h3>
      <p className="text-sm text-gray-400 mt-2">
        Add up to 3 topics to help others find your poll. We'll show it to the
        people who'll enjoy it most!
      </p>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {topics.map((topic) => {
          const id = resolveId(topic);
          const title = resolveTitle(topic);
          const topicKey = id || title;
          const rawImage = resolveImage(topic);
          const imageSrc =
            failedImages[topicKey] || !rawImage ? fallbackImage : rawImage;
          const isSelected = selectedTopics.includes(id);
          const atLimit = !isSelected && selectedTopics.length >= 3;

          return (
            <button
              key={topicKey}
              onClick={() => toggleTopic(id)}
              disabled={atLimit}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-opacity duration-200 ${
                isSelected
                  ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white shadow-sm"
                  : "bg-gray-50 border border-gray-100 text-gray-700"
              } ${atLimit ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <img
                src={imageSrc}
                alt={title}
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  markFailed(topicKey);
                }}
              />
              <span>{title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ChooseTopicComponent;
