import React, { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import Button from "../../Shared/Button";

function PostPoll() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["Option 1", "Option 2"]);
  const [topics] = useState([
    {
      name: "Technology",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Entertainment",
      img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Sports",
      img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "News and Politics",
      img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Gaming",
      img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Fashion",
      img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Animals and Nature",
      img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Travel and Geography",
      img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Health and Wellness",
      img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Science and Education",
      img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Community",
      img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Lifestyle",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Art & Design",
      img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Food and Drink",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Business",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Humor",
      img: "https://images.unsplash.com/photo-1517638851339-a711cfcf3279?auto=format&fit=crop&q=80&w=800",
    },
  ]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [allowComments, setAllowComments] = useState(true);

  function addOption() {
    setOptions((s) => [...s, `Option ${s.length + 1}`]);
  }

  function updateOption(i, value) {
    setOptions((s) => s.map((o, idx) => (idx === i ? value : o)));
  }

  function toggleTopic(t) {
    setSelectedTopics((s) => {
      if (s.includes(t)) {
        return s.filter((x) => x !== t);
      } else if (s.length < 3) {
        return [...s, t];
      } else {
        return s; // Do not add more than 3
      }
    });
  }

  // Listen for a global event so other UI (e.g. Sidebar) can open this modal
  React.useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }
    window.addEventListener("openPostPoll", handleOpen);
    return () => window.removeEventListener("openPostPoll", handleOpen);
  }, []);

  return (
    <div>
      {/* Collapsed composer */}
      {!open && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-4">
            <img
              src="/dummyavatar.jpg"
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <button
              onClick={() => setOpen(true)}
              className="flex-1 text-left bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-gray-500"
            >
              What's on your mind? Create a poll...
            </button>

            <button
              onClick={() => setOpen(true)}
              className="ml-2 bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] text-white p-3 rounded-lg"
            >
              <IoAddCircleOutline className="text-2xl " />
            </button>
          </div>
        </div>
      )}

      {/* Modal / Expanded composer */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-10 w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-h-[80vh] overflow-y-auto">
            {/* Close (X) button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            {/* Top: Poll format choices */}
            <div className="mb-4 flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="text-sm font-medium">Only Text Poll</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Single Image Poll</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Image Per Option</span>
              </label>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Left column (main) */}
              <div className="col-span-8 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-md font-semibold text-gray-800">
                    Poll Details
                  </h3>
                  <div className="mt-4">
                    <label className="text-md text-gray-600">
                      Write Poll Question
                    </label>
                    <div className="relative">
                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What would you like to ask?"
                        className="w-full mt-2 border border-gray-100 rounded-lg p-4 h-28 text-sm text-gray-700 bg-gray-50"
                        maxLength={280}
                      />
                      <div className="absolute right-3 bottom-2 text-xs text-gray-400">
                        {question.length}/280
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="text-md text-gray-600">
                      Answer Options
                    </label>
                    <div className="space-y-3 mt-3">
                      {options.map((opt, i) => (
                        <input
                          key={i}
                          value={opt}
                          onChange={(e) => updateOption(i, e.target.value)}
                          className="w-full bg-white border border-gray-100 rounded-full px-4 py-3 text-sm shadow-sm"
                        />
                      ))}
                    </div>

                    <button
                      onClick={addOption}
                      className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700 border border-gray-200 rounded-md px-3 py-1"
                    >
                      <IoAddCircleOutline className="text-lg" /> Add Option
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-md font-semibold text-gray-800">
                    Choose Topic(s)
                  </h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Add up to 3 topics to help others find your poll. We'll show
                    it to the people who'll enjoy it most!
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {topics.map((topic) => (
                      <button
                        key={topic.name}
                        onClick={() => toggleTopic(topic.name)}
                        disabled={
                          !selectedTopics.includes(topic.name) &&
                          selectedTopics.length >= 3
                        }
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-opacity duration-200 ${selectedTopics.includes(topic.name) ? "bg-blue-50 border border-blue-100 text-blue-700" : "bg-gray-50 border border-gray-100 text-gray-700"} ${!selectedTopics.includes(topic.name) && selectedTopics.length >= 3 ? "opacity-50 cursor-not-allowed" : ""}`}
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

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-md font-semibold text-gray-800">
                    Poll Settings
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="text-md font-medium text-gray-900">
                        Duration
                      </div>
                      <select className="mt-2 w-48 border border-gray-100 rounded-md px-3 py-2 text-md bg-white">
                        <option>No end date</option>
                        <option>12 Hours</option>
                        <option>1 day</option>
                        <option>7 days</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-md font-medium">
                          Allow Comments
                        </div>
                        <div className="text-xs text-gray-400">
                          Let people discuss this poll
                        </div>
                      </div>
                      <button
                        onClick={() => setAllowComments((s) => !s)}
                        className={`w-12 h-6 rounded-full p-1 ${allowComments ? "bg-blue-500" : "bg-gray-200"}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transform ${allowComments ? "translate-x-6" : ""}`}
                        />
                      </button>
                    </div>

                    {/* <div>
                      <div className="text-sm text-gray-600">
                        Hide Poll From...
                      </div>
                      <input
                        className="mt-2 w-full border border-gray-100 rounded-md px-3 py-2 text-sm bg-white"
                        placeholder=""
                      />
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Right column (preview + tips + actions) */}
              <div className="col-span-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-4">
                  <h4 className="text-md font-semibold text-gray-800">
                    Preview
                  </h4>
                  <div className="mt-3 border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="/dummyavatar.jpg"
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="text-sm font-semibold">You</div>
                        <div className="text-xs text-gray-400">Just now</div>
                      </div>
                    </div>

                    <div className="mt-4 font-semibold text-black">
                      {question || "Your poll question will appear here..."}
                    </div>

                    <div className="mt-3 space-y-3">
                      {options.map((o, i) => (
                        <div
                          key={i}
                          className="rounded-md border border-gray-100 p-3 bg-white text-md text-black"
                        >
                          {o}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 bg-blue-50 rounded-md p-3 text-md text-gray-700">
                    <div className="font-semibold text-blue-700">
                      Publishing Tips
                    </div>
                    <ul className="mt-2 list-disc ml-5 text-sm text-gray-600 space-y-1">
                      <li>Clear, concise questions get better engagement</li>
                      <li>Provide balanced answer options</li>
                      <li>Choose the right category for better reach</li>
                      <li>Enable comments for deeper insights</li>
                    </ul>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <button className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 bg-white">
                      Save as Draft
                    </button>
                    <div>
                      <Button label="Publish Poll" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostPoll;
