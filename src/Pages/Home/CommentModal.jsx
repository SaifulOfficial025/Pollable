import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchComments, createComment } from "../../Redux/Polls/Comment";
import { API_BASE_URL } from "../../Redux/Config";

function CommentModal({ initialOpen = true, onClose, pollId, onCommentAdded }) {
  const [open, setOpen] = useState(initialOpen);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const toThread = (items) => {
    const byId = new Map();
    const roots = [];
    (items || []).forEach((c) => {
      byId.set(c.id, { ...c, children: [] });
    });
    byId.forEach((c) => {
      const parentId = c.parent?.id || c.parent_comment_id || c.parent;
      if (parentId && byId.has(parentId)) {
        byId.get(parentId).children.push(c);
      } else {
        roots.push(c);
      }
    });
    return roots;
  };

  const formatRelativeTime = (value) => {
    if (!value) return "Just now";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Just now";
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffSeconds < 45) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    const showYear = date.getFullYear() !== now.getFullYear();
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      ...(showYear ? { year: "numeric" } : {}),
    });
  };

  function handleClose() {
    setOpen(false);
    if (onClose) onClose();
  }

  useEffect(() => {
    if (!open || !pollId) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchComments(pollId);
        if (!cancelled) setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load comments.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [open, pollId]);

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;
    if (!pollId) {
      setError("Missing poll id.");
      return;
    }
    setSubmitting(true);
    setError("");
    const tempComment = {
      id: `temp-${Date.now()}`,
      user_username: "You",
      content: content.trim(),
      created_at: new Date().toISOString(),
      is_anonymous: false,
      parent: replyTo
        ? {
            id: replyTo.id,
            user_username: replyTo.user_username,
            content: replyTo.content,
            is_anonymous: replyTo.is_anonymous,
            created_at: replyTo.created_at,
            type: replyTo.type,
          }
        : null,
    };
    setComments((prev) => [tempComment, ...prev]);
    try {
      const created = await createComment({
        pollId,
        content: content.trim(),
        is_anonymous: false,
        parent_comment_id: replyTo?.id || null,
      });
      setComments((prev) => [
        created || tempComment,
        ...prev.filter((c) => c.id !== tempComment.id),
      ]);
      setContent("");
      setReplyTo(null);
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      setComments((prev) => prev.filter((c) => c.id !== tempComment.id));
      setError(err?.message || "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const toAbsolute = (url) => {
    if (!url) return "";
    if (typeof url !== "string") return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  const getProfilePath = (userInfo = {}) => {
    const username = userInfo.username;
    const userId = userInfo.id;
    if (username && userId) {
      return `/user/${encodeURIComponent(username)}?user_id=${encodeURIComponent(userId)}`;
    }
    if (username) return `/user/${encodeURIComponent(username)}`;
    if (userId) return `/user/?user_id=${encodeURIComponent(userId)}`;
    return "/user/";
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="text-sm text-gray-600 font-medium">
            Comment <span className="text-gray-400">• {comments.length}</span>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close comments"
            className="text-gray-400 hover:text-gray-700 text-lg font-medium focus:outline-none"
          >
            ×
          </button>
        </div>

        {/* Comments list */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
          {loading && (
            <div className="text-sm text-gray-500">Loading comments...</div>
          )}
          {error && !loading && (
            <div className="text-sm text-red-500">{error}</div>
          )}
          {!loading && !error && comments.length === 0 && (
            <div className="text-sm text-gray-500">No comments yet.</div>
          )}
          {!loading &&
            !error &&
            toThread(comments).map((c) => {
              const renderNode = (node, depth = 0) => (
                <div
                  key={node.id}
                  className={`flex items-start gap-3 ${depth > 0 ? "mt-3" : ""}`}
                >
                  <Link
                    to={getProfilePath(node.user_info)}
                    className="shrink-0"
                  >
                    <img
                      src={
                        toAbsolute(node.user_info?.profile_image) ||
                        "/dummyavatar.jpg"
                      }
                      alt={node.user_info?.name || node.user_username || "User"}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <Link
                        to={getProfilePath(node.user_info)}
                        className="text-sm font-semibold text-gray-800 hover:underline"
                      >
                        {node.user_info?.name || node.user_username || "User"}
                      </Link>
                      <div className="text-xs text-gray-400">
                        {formatRelativeTime(node.created_at)}
                      </div>
                    </div>
                    <div className="mt-2 bg-gray-50 text-gray-800 rounded-2xl p-3 text-sm border border-gray-100">
                      {node.content}
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyTo(node);
                          setContent("");
                        }}
                        className="font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Reply
                      </button>
                    </div>
                    {node.children?.length > 0 && (
                      <div className="mt-3 space-y-3 border-l border-gray-200 pl-4">
                        {node.children.map((child) =>
                          renderNode(child, depth + 1),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
              return renderNode(c);
            })}
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src="/dummyavatar.jpg"
              alt="you"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="flex-1">
              {replyTo && (
                <div className="flex items-center justify-between text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-2 mb-2">
                  <span>
                    Replying to {replyTo.user_username || "User"}:{" "}
                    {replyTo.content}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    ×
                  </button>
                </div>
              )}
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Write a comment..."
                className="w-full bg-gray-100 rounded-full px-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
                disabled={submitting}
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !content.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
