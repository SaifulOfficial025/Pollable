import React, { useState, useEffect, useRef } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { BsShare, BsThreeDotsVertical } from "react-icons/bs";
import { IoBookmarkOutline } from "react-icons/io5";
import { FiFlag, FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import CommentModal from "./CommentModal";
import PollDemographicModal from "./PollDemographicModal";
import { Link } from "react-router-dom";
import { createVote } from "../../Redux/Polls/VoteCreate";
import { togglePollReaction } from "../../Redux/Polls/PollReaction";
import { bookmarkPoll, reportPoll } from "../../Redux/Polls/ReportBookmark";
import { deletePoll } from "../../Redux/Polls/DeletePoll";
import { fetchPollById } from "../../Redux/Polls/EditPolls";
import VoteUsersandReactionModal from "./VoteUsersandReactionModal";

function PollCardwithMultiImage({ pollData }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showDemographics, setShowDemographics] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [audience, setAudience] = useState("everyone");
  const [showAudienceMenu, setShowAudienceMenu] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState("");
  const [localOptions, setLocalOptions] = useState([]);
  const [localVoteTotal, setLocalVoteTotal] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showVoteUsersModal, setShowVoteUsersModal] = useState(false);
  const [activeVotersOption, setActiveVotersOption] = useState(null);
  const [peopleModalType, setPeopleModalType] = useState("vote");

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
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      timeAgo: "1 hour ago",
    },
    question = "What's your question?",
    options = [
      {
        id: 1,
        label: "The Nomad Minimalist",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        votes: 300,
        percent: 30,
      },
      {
        id: 2,
        label: "The Playful Romantic",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        votes: 300,
        percent: 30,
      },
      {
        id: 3,
        label: "The Real Gentleman",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        votes: 300,
        percent: 30,
      },
      {
        id: 4,
        label: "The Bold Adventurer",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        votes: 100,
        percent: 10,
      },
    ],
    likes = 245,
    comments = 82,
    Polloftheday = false,
    poll_of_the_day = false,
    is_poll_of_the_day = false,
    isOwner = true,
    hasVoted: backendHasVoted = false,
    votedOptionId = null,
    isReacted = false,
  } = pollData || {};

  const isOwnPoll = Boolean(
    isOwner || pollData?.is_my_poll || pollData?.is_owner || pollData?.isMyPoll,
  );

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

  const profileUsername =
    user?.username || pollData?.username || pollData?.user_username || "";
  const profileUserId =
    user?.id ||
    pollData?.userId ||
    pollData?.user_id ||
    pollData?.user?.user_id ||
    null;
  const profileQuery = profileUserId
    ? `?user_id=${encodeURIComponent(profileUserId)}`
    : "";
  const profilePath = profileUsername
    ? `/user/${encodeURIComponent(profileUsername)}${profileQuery}`
    : `/user${profileQuery}`;

  useEffect(() => {
    setLocalVoteTotal(voteTotalFromData);
    setLocalOptions(recomputePercents(options, voteTotalFromData));
    setLiked(Boolean(isReacted));
    setLikesCount(likes ?? 0);
    setCommentCount(comments ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollData?.id, options, isReacted, likes, comments]);

  useEffect(() => {
    if (
      backendHasVoted &&
      votedOptionId !== null &&
      votedOptionId !== undefined
    ) {
      setSelectedOption(votedOptionId);
    }
  }, [backendHasVoted, votedOptionId]);

  const hasVoted = backendHasVoted || selectedOption !== null;
  const voteTextClass = isPollOfTheDay ? "text-white/80" : "text-gray-600";

  const handleVote = async (optionId) => {
    if (hasVoted || isVoting) return;
    if (!optionId) {
      setVoteError("Option unavailable. Please try again.");
      return;
    }
    setVoteError("");
    setIsVoting(true);
    setSelectedOption(optionId);

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
    } catch (err) {
      setSelectedOption(null);
      setLocalVoteTotal(prevVoteTotal);
      setLocalOptions(prevOptions);
      setVoteError(err?.message || "Unable to submit vote.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleEdit = async () => {
    try {
      const fullPoll = await fetchPollById(pollData?.id);
      const event = new CustomEvent("openPostPoll", { detail: fullPoll });
      window.dispatchEvent(event);
    } catch (err) {
      showToast("error", err?.message || "Unable to load poll for editing.");
    } finally {
      setShowMenu(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePoll(pollData?.id);
      setIsDeleted(true);
      setShowMenu(false);
    } catch (err) {
      showToast("error", err?.message || "Unable to delete poll.");
      setShowMenu(false);
    }
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

  const openVotersModalForOption = (opt) => {
    const optionId = opt?.id || opt?.option_id;
    if (!optionId) return;
    setPeopleModalType("vote");
    setActiveVotersOption({
      id: optionId,
      label: opt?.label || opt?.title || "this option",
    });
    setShowVoteUsersModal(true);
  };

  const openReactionPeopleModal = () => {
    setPeopleModalType("reaction");
    setActiveVotersOption(null);
    setShowVoteUsersModal(true);
  };

  if (isDeleted) return null;

  // Dynamic grid layout based on number of options
  const getGridCols = () => {
    const count = localOptions.length;
    if (count <= 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2 md:grid-cols-4";
    if (count <= 6) return "grid-cols-2 md:grid-cols-3";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
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
          <Link to={profilePath}>
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

                {isOwnPoll ? (
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
                )}
              </div>
            )}
          </div>
        </div>

        {/* Question */}
        <h3 className="mt-4 text-black text-base sm:text-lg font-semibold">
          {question}
        </h3>

        {/* Poll image options */}
        <div className={`mt-4 grid ${getGridCols()} gap-3`}>
          {localOptions.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const displayPercent = clampPercent(opt.percent ?? 0);
            const displayPercentLabel = formatPercentLabel(displayPercent);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  if (hasVoted) {
                    openVotersModalForOption(opt);
                    return;
                  }
                  handleVote(opt.id);
                }}
                disabled={isVoting}
                className="relative group focus:outline-none disabled:cursor-not-allowed"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden transition-transform duration-150 ease-out hover:scale-[1.02]">
                  {/* Image */}
                  <img
                    src={opt.image}
                    alt={opt.label}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay when voted and has percentage */}
                  {hasVoted && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                        isSelected
                          ? "bg-gradient-to-br from-[#4a90e2]/80 to-[#7c3bed]/80"
                          : "bg-black/20"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`text-2xl sm:text-4xl font-bold ${
                            isSelected ? "text-white" : "text-white"
                          }`}
                        >
                          {displayPercentLabel}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Label at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-3">
                    <p className="text-white text-sm sm:text-md text-left font-medium truncate">
                      {opt.label}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Total votes display after voting */}
        {hasVoted && (
          <div className={`mt-4 text-center text-sm ${voteTextClass}`}>
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
              <button
                type="button"
                onClick={openReactionPeopleModal}
                className="text-gray-700 text-xs sm:text-sm hover:text-blue-600"
              >
                {likesCount}
              </button>
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
      {showVoteUsersModal && (
        <VoteUsersandReactionModal
          initialOpen={true}
          title={
            peopleModalType === "reaction"
              ? "Reacted By"
              : `Voters for ${activeVotersOption?.label || "option"}`
          }
          pollId={pollData?.id}
          mode={peopleModalType}
          optionId={
            peopleModalType === "vote" ? activeVotersOption?.id : undefined
          }
          onClose={() => {
            setShowVoteUsersModal(false);
            setActiveVotersOption(null);
            setPeopleModalType("vote");
          }}
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

export default PollCardwithMultiImage;
