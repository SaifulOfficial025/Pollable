import { buildApiUrl } from "../Config";

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

const getAuthHeaders = () => {
  const token = getStoredAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizePrivacyForBackend = (privacy) => {
  if (!privacy) return "everyone";

  const normalized = String(privacy).toLowerCase().trim();
  if (normalized === "followers") return "only_following";
  if (normalized === "close-friends" || normalized === "close_friends") {
    return "only_me";
  }

  const allowed = new Set([
    "everyone",
    "only_following",
    "link_only",
    "only_me",
  ]);

  return allowed.has(normalized) ? normalized : "everyone";
};

export async function fetchPollById(pollId) {
  if (!pollId) {
    throw new Error("Poll identifier is required.");
  }

  const token = getStoredAccessToken();
  if (!token) {
    throw new Error("No access token found. Please sign in again.");
  }

  const response = await fetch(
    buildApiUrl(`/polls/?poll_id=${encodeURIComponent(pollId)}`),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Failed to fetch poll.");
  }

  return data?.data || data;
}

export async function updatePoll(pollId, pollPayload = {}) {
  if (!pollId) {
    throw new Error("Poll identifier is required.");
  }

  const token = getStoredAccessToken();
  if (!token) {
    throw new Error("No access token found. Please sign in again.");
  }

  const response = await fetch(buildApiUrl(`/polls/`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      ...pollPayload,
      privacy: normalizePrivacyForBackend(pollPayload?.privacy),
      poll_id: pollId,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Failed to update poll.");
  }

  return data;
}

export default { fetchPollById, updatePoll };
