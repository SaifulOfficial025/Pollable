import React, { useState, useEffect, useRef } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { BsShare } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoBookmarkOutline } from "react-icons/io5";
import { FiFlag, FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import CommentModal from "./CommentModal";
import PollDemographicModal from "./PollDemographicModal";
import { Link } from "react-router-dom";
import { createVote } from "../../Redux/Polls/VoteCreate";
import { togglePollReaction } from "../../Redux/Polls/PollReaction";
import { bookmarkPoll, reportPoll } from "../../Redux/Polls/ReportBookmark";

function PollCard({ pollData }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showDemographics, setShowDemographics] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [audience, setAudience] = useState("everyone");
  const [showAudienceMenu, setShowAudienceMenu] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState("");
  const [localOptions, setLocalOptions] = useState([]);
  const [localVoteTotal, setLocalVoteTotal] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const {
    user = {
      name: "Anonymous User",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      timeAgo: "1 hour ago",
    },
    question = "What's your question?",
    options = [
      { label: "Fully Remote", votes: 684, percent: 68, id: 1 },
      { label: "Hybrid (2-3 days office)", votes: 241, percent: 24, id: 2 },
      { label: "Full-time Office", votes: 80, percent: 8, id: 3 },
    ],
    likes = 245,
    comments = 82,
    Polloftheday = false,
    poll_of_the_day = false,
    is_poll_of_the_day = false,
    isOwner = false,
    hasVoted: backendHasVoted = false,
    votedOptionId = null,
    isReacted = false,
  } = pollData || {};

  const voteTotalFromData = pollData?.voteTotal ?? pollData?.vote_count ?? 0;

  const isPollOfTheDay = Boolean(
    Polloftheday || poll_of_the_day || is_poll_of_the_day,
  );

  const toVotes = (opt) => opt?.votes ?? opt?.vote_count ?? 0;

  const recomputePercents = (opts, total) =>
    (opts || []).map((opt) => {
      const votes = toVotes(opt);
      const percent = total > 0 ? (votes / total) * 100 : 0;
      return { ...opt, votes, percent };
    });

  const clampPercent = (value) => {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, value));
  };

  const formatPercentLabel = (value) => {
    if (!Number.isFinite(value)) return "0";
    const fixed = clampPercent(value).toFixed(2);
    return fixed.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
  };

  useEffect(() => {
    setLocalVoteTotal(voteTotalFromData);
    setLocalOptions(recomputePercents(options, voteTotalFromData));
    setLiked(Boolean(isReacted));
    setLikesCount(likes ?? 0);
    setCommentCount(comments ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollData?.id, options, isReacted, likes, comments]);
  useEffect(() => {
    if (backendHasVoted && localOptions?.length) {
      const matchIdx = localOptions.findIndex(
        (opt) => (opt.id || opt.option_id) === votedOptionId,
      );
      if (matchIdx >= 0) {
        setSelectedOption(matchIdx);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendHasVoted, votedOptionId, localOptions]);

  const hasVoted = backendHasVoted || selectedOption !== null;
  const voteTextClass = isPollOfTheDay ? "text-white/80" : "text-gray-600";

  const handleVote = async (opt, idx) => {
    if (hasVoted || isVoting) return;
    const optionId = opt?.id || opt?.option_id;
    if (!optionId) {
      setVoteError("Option unavailable. Please try again.");
      return;
    }
    setVoteError("");
    setIsVoting(true);
    setSelectedOption(idx);

    const prevOptions = localOptions;
    const prevVoteTotal = localVoteTotal;
    const optimisticTotal = prevVoteTotal + 1;
    const optimisticOptions = recomputePercents(
      prevOptions.map((o) => {
        if ((o.id || o.option_id) === optionId) {
          const votes = toVotes(o) + 1;
          return { ...o, votes };
        }
        return o;
      }),
      optimisticTotal,
    );
    setLocalVoteTotal(optimisticTotal);
    setLocalOptions(optimisticOptions);
    try {
      await createVote({
        pollId: pollData?.id,
        optionId,
        isAnonymous,
      });
      // Live updates will arrive via websocket; keep local selection locked.
    } catch (err) {
      setSelectedOption(null);
      setLocalVoteTotal(prevVoteTotal);
      setLocalOptions(prevOptions);
      setVoteError(err?.message || "Unable to submit vote.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleEdit = () => {
    // Dispatch custom event to open the CreatePost modal with poll data
    const event = new CustomEvent("openPostPoll", { detail: pollData });
    window.dispatchEvent(event);
    setShowMenu(false);
  };

  const handleDelete = () => {
    // Add delete functionality here
    console.log("Delete poll", pollData);
    setShowMenu(false);
  };

  const handleReact = async () => {
    const optimisticLiked = !liked;
    const delta = optimisticLiked ? 1 : -1;
    const prevLiked = liked;
    const prevLikes = likesCount;
    setLiked(optimisticLiked);
    setLikesCount(Math.max(0, prevLikes + delta));
    try {
      await togglePollReaction(pollData?.id);
    } catch (err) {
      setLiked(prevLiked);
      setLikesCount(prevLikes);
      setVoteError(err?.message || "Unable to react to poll.");
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  const handleBookmark = async () => {
    try {
      await bookmarkPoll(pollData?.id);
      showToast("success", "Poll bookmarked");
    } catch (err) {
      showToast("error", err?.message || "Unable to bookmark poll.");
    } finally {
      setShowMenu(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) return;
    setReportSubmitting(true);
    try {
      await reportPoll(pollData?.id, reportReason.trim());
      showToast("success", "Report submitted");
      setShowReportModal(false);
      setReportReason("");
    } catch (err) {
      showToast("error", err?.message || "Unable to submit report.");
    } finally {
      setReportSubmitting(false);
      setShowMenu(false);
    }
  };

  return (
    <>
      <div
        className={`max-w-full rounded-2xl border shadow-sm p-3 sm:p-5 ${
          isPollOfTheDay
            ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] border-transparent text-white"
            : "bg-white border-gray-100"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <Link to="/user/">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-md font-bold text-black">{user.name}</div>
                <div className="text-xs text-gray-600">
                  {isPollOfTheDay ? (
                    <span className="flex items-center gap-1 font-semibold text-purple-600">
                      <span>⭐</span>
                      Poll of the day
                    </span>
                  ) : (
                    user.timeAgo
                  )}
                </div>
              </div>
            </div>
          </Link>

          <div ref={menuRef} className="relative text-gray-400 text-lg">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <BsThreeDotsVertical />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-20 text-sm">
                {isOwner ? (
                  // Owner's menu: Edit and Delete
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                    >
                      <FiEdit className="w-5 h-5" />
                      <span className="font-semibold text-md">Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-red-500"
                    >
                      <MdDelete className="w-5 h-5" />
                      <span className="font-semibold text-md">Delete</span>
                    </button>
                  </>
                ) : (
                  // Non-owner's menu: Vote Anonymously, Bookmark, Report
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAnonymous((prev) => !prev);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 gap-3 text-sm font-medium rounded-lg bg-white hover:bg-gray-50 text-gray-800 transition-colors duration-150 cursor-pointer"
                    >
                      <img
                        src="/anonymous.svg"
                        alt="anonymous vote"
                        className="w-5 h-5"
                      />
                      <span className="font-semibold text-md flex-1 text-left">
                        Vote Anonymously?
                      </span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAnonymous((prev) => !prev);
                        }}
                        className={`ml-2 w-9 h-5 rounded-full flex items-center px-0.5 transition-colors duration-150 ${
                          isAnonymous
                            ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed] justify-end"
                            : "bg-gray-300 justify-start"
                        }`}
                      >
                        <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBookmark}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700"
                    >
                      <IoBookmarkOutline className="w-5 h-5" />
                      <span className="font-semibold text-md">Bookmark</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReportModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-red-500"
                    >
                      <FiFlag className="w-5 h-5" />
                      <span className="font-semibold text-md">Report</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Question */}
        <h3 className="mt-4 text-black text-base sm:text-lg font-semibold">
          {question}
        </h3>

        {/* Poll options */}
        <div className="mt-4 space-y-3">
          {localOptions.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const hasVoted = selectedOption !== null || backendHasVoted;
            const displayPercent = clampPercent(opt.percent ?? 0);
            const displayPercentLabel = formatPercentLabel(displayPercent);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleVote(opt, idx)}
                disabled={hasVoted || isVoting}
                className="w-full text-left focus:outline-none disabled:cursor-not-allowed"
              >
                <div className="relative flex items-center gap-3 transition-transform duration-150 ease-out hover:-translate-y-0.5">
                  <div className="flex-1 relative">
                    <div
                      className={`w-full rounded-lg h-11 sm:h-14 flex items-center relative overflow-hidden transition-shadow duration-150 bg-blue-50 ${
                        !isSelected ? "hover:shadow-md" : ""
                      }`}
                    >
                      <div
                        className={`h-11 sm:h-14 rounded-lg absolute top-0 left-0 transition-[width] duration-300 ${
                          isSelected
                            ? "bg-gradient-to-r from-[#4a90e2] to-[#7c3bed]"
                            : "bg-blue-200"
                        }`}
                        style={{
                          width: hasVoted ? `${displayPercent}%` : "0%",
                        }}
                      />
                      <div className="absolute left-3 sm:left-6 z-10">
                        <span
                          className={`text-sm sm:text-md font-semibold ${
                            isSelected ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </div>
                      <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2 z-10">
                        {hasVoted && (
                          <>
                            <div className="hidden sm:block text-sm text-gray-600 px-2 rounded">
                              {opt.votes} votes
                            </div>
                            <div className="text-sm sm:text-lg font-bold text-[#4c8df6] px-1 sm:px-2 rounded">
                              {displayPercentLabel}%
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {hasVoted && (
          <div className={`mt-4 text-sm ${voteTextClass}`}>
            Total votes: {localVoteTotal.toLocaleString()}
          </div>
        )}

        {voteError && (
          <div className="mt-2 text-sm text-red-500">{voteError}</div>
        )}

        {/* Footer actions */}
        <div className="mt-5 border-t pt-4 text-sm text-gray-500">
          <div className="grid grid-cols-4 items-center text-center">
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <button
                onClick={handleReact}
                className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-red-500 h-8"
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  {liked ? (
                    <FaHeart className="text-red-600 text-xl" />
                  ) : (
                    <CiHeart className="text-xl" />
                  )}
                </span>
              </button>
              <span className="text-gray-700 text-xs sm:text-sm">
                {likesCount}
              </span>
            </div>

            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowComments(true)}
                className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <FaRegComment className="text-lg text-gray-500" />
                <span className="text-gray-700 hidden sm:inline">
                  {commentCount} comments
                </span>
                <span className="text-gray-700 sm:hidden text-xs">
                  {commentCount}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowDemographics(true)}
                className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <img
                  src="/demographic.svg"
                  alt="demographics"
                  className="w-5 h-5"
                />
                <span className="text-gray-700 hidden sm:inline">
                  Demographics
                </span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2">
              <BsShare className="text-lg text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      {showComments && (
        <CommentModal
          initialOpen={true}
          pollId={pollData?.id}
          onCommentAdded={() => setCommentCount((prev) => prev + 1)}
          onClose={() => setShowComments(false)}
        />
      )}
      {showDemographics && (
        <PollDemographicModal
          initialOpen={true}
          pollId={pollData?.id}
          onClose={() => setShowDemographics(false)}
        />
      )}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !reportSubmitting && setShowReportModal(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Report poll
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Tell us what is wrong with this poll.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !reportSubmitting && setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close report"
              >
                ×
              </button>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Reason
              </label>
              <textarea
                rows={4}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm p-3"
                placeholder="Describe the issue"
                disabled={reportSubmitting}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                disabled={reportSubmitting}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReportSubmit}
                disabled={reportSubmitting || !reportReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
              >
                {reportSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-semibold text-white ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
}

export default PollCard;
