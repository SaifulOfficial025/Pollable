import { API_BASE_URL } from "../Config";

const getStoredAccessToken = () => {
  const token = localStorage.getItem("accessToken");
  if (token) return token;

  const sessionToken = sessionStorage.getItem("accessToken");
  if (sessionToken) return sessionToken;

  const authResponseRaw = localStorage.getItem("authResponse");
  if (!authResponseRaw) return "";

  try {
    const parsed = JSON.parse(authResponseRaw);
    return parsed?.data?.access || "";
  } catch {
    return "";
  }
};

const formatRelativeTime = (value) => {
  if (!value) return "Just now";

  const toDate = (input) => {
    if (!input) return null;
    if (input instanceof Date) return input;
    const asDate = new Date(input);
    if (!Number.isNaN(asDate.getTime())) return asDate;
    const asNumber = Number(input);
    if (!Number.isNaN(asNumber)) {
      const fromNumber = new Date(asNumber);
      if (!Number.isNaN(fromNumber.getTime())) return fromNumber;
    }
    return null;
  };

  const date = toDate(value);
  if (!date) return "Just now";

  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Within the first day: show minutes/hours granularity
  if (diffSeconds < 45) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;

  // Beyond 1 day: show calendar date (month/day, add year if different)
  const showYear = date.getFullYear() !== now.getFullYear();
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(showYear ? { year: "numeric" } : {}),
  });
};

export const POLLS_WS_URL = "ws://10.10.13.95:8500/ws/polls/";

export function createPollsSocket({
  onMessage,
  onError,
  onOpen,
  onClose,
} = {}) {
  const token = getStoredAccessToken();
  if (!token) {
    throw new Error("No access token found. Please sign in again.");
  }

  const socket = new WebSocket(`${POLLS_WS_URL}?token=${token}`);
  const pending = [];

  const flush = () => {
    while (pending.length && socket.readyState === WebSocket.OPEN) {
      const payload = pending.shift();
      socket.send(payload);
    }
  };

  socket.onopen = () => {
    flush();
    onOpen?.();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage?.(data);
    } catch (err) {
      // ignore malformed messages
    }
  };

  socket.onerror = (event) => {
    onError?.(event);
  };

  socket.onclose = () => {
    onClose?.();
  };

  const safeSend = (obj) => {
    const payload = JSON.stringify(obj);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(payload);
    } else if (socket.readyState === WebSocket.CONNECTING) {
      pending.push(payload);
    }
  };

  return {
    socket,
    sendGetFeed: ({ limit = 10, offset = 0 } = {}) =>
      safeSend({ action: "get_feed", limit, offset }),
    sendSearchPolls: ({ query = "", limit = 20, offset = 0 } = {}) =>
      safeSend({ action: "search_polls", query, limit, offset }),
    sendGetTrending: ({ hours = 150, limit = 10 } = {}) =>
      safeSend({ action: "get_trending", hours, limit }),
    sendGetMyDrafts: ({ limit = 20, offset = 0 } = {}) =>
      safeSend({ action: "get_my_drafts", limit, offset }),
    close: () => socket.close(),
  };
}

export const normalizePoll = (poll) => {
  if (!poll) return null;

  const pollType = poll.poll_type || poll.type || "text_only";

  const toAbsolute = (url) =>
    url && typeof url === "string"
      ? url.startsWith("http")
        ? url
        : `${API_BASE_URL}${url}`
      : url;

  const user = poll.user || {};
  const userInfo = poll.user_info || {};

  const userId =
    user.id ||
    user.user_id ||
    userInfo.id ||
    userInfo.user_id ||
    poll.user_id ||
    poll.userId ||
    null;

  const userUsername =
    user.username ||
    userInfo.username ||
    poll.user_username ||
    poll.username ||
    null;

  const userName =
    user.name ||
    userInfo.name ||
    poll.user_name ||
    poll.name ||
    userUsername ||
    userInfo.username ||
    poll.user_username ||
    poll.username ||
    "User";

  const avatarRaw =
    user.image_full_url ||
    poll.user_image_full_url ||
    userInfo.profile_image_full_url ||
    userInfo.profile_image ||
    user.image ||
    user.avatar ||
    poll.user_image ||
    "";
  const avatar = avatarRaw ? toAbsolute(avatarRaw) : "/dummyavatar.jpg";

  const baseOptions = Array.isArray(poll.options) ? poll.options : [];

  const rawVotedOptionId =
    poll.my_reaction?.voted_option_id ?? poll.my_reaction?.option_id ?? null;
  const votedOptionId =
    typeof rawVotedOptionId === "number" || typeof rawVotedOptionId === "string"
      ? rawVotedOptionId
      : null;

  const mapOption = (opt) => ({
    label:
      opt?.label || opt?.title || opt?.option_text || opt?.text || "Option",
    votes: opt?.votes ?? opt?.vote_count ?? 0,
    percent: opt?.percent ?? opt?.percentage ?? 0,
    image: toAbsolute(opt?.image_full_url || opt?.image || ""),
    id: opt?.id || opt?.option_id || opt?.label || Math.random().toString(36),
  });

  return {
    id: poll.id || poll.poll_id || Math.random().toString(36),
    poll_type: pollType,
    question: poll.question || poll.title || poll.name || "",
    bannerImage: toAbsolute(
      poll.banner_image_full_url ||
        poll.image_full_url ||
        poll.banner_image ||
        poll.image ||
        "",
    ),
    options: baseOptions.map(mapOption),
    likes: poll.likes || poll.react_count || 0,
    isReacted: Boolean(poll.my_reaction?.is_reacted),
    comments: poll.comments || poll.comment_count || 0,
    voteTotal: poll.vote_count || poll.total_votes || 0,
    Polloftheday: Boolean(poll.Polloftheday || poll.poll_of_the_day),
    isOwner: Boolean(poll.is_owner || poll.is_my_poll),
    is_owner: Boolean(poll.is_owner),
    is_my_poll: Boolean(poll.is_my_poll),
    isMyPoll: Boolean(poll.is_my_poll || poll.is_owner),
    hasVoted: Boolean(poll.my_reaction?.is_voted),
    votedOptionId,
    userId: userId ?? null,
    user_id: userId ?? null,
    username: userUsername || "",
    user: {
      id: userId ?? null,
      username: userUsername || "",
      name: userName,
      avatar,
      timeAgo: formatRelativeTime(
        poll.created_at || poll.timeAgo || user.timeAgo,
      ),
    },
  };
};
