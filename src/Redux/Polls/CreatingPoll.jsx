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

let cachedTopics = null;
let cachedTopicsPromise = null;

export async function fetchTopics() {
  if (cachedTopics) return cachedTopics;
  if (cachedTopicsPromise) return cachedTopicsPromise;

  cachedTopicsPromise = (async () => {
    const response = await fetch(buildApiUrl("/polls/topics/"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      cachedTopicsPromise = null;
      throw new Error(
        data?.detail || data?.message || "Failed to load topics.",
      );
    }

    const list = Array.isArray(data?.data) ? data.data : [];
    const mapped = list.map((t) => ({
      id: t.id ?? t.topic_id ?? null,
      title: t.title || t.name || "Untitled",
      image: t.image_full_url || t.image || null,
    }));

    cachedTopics = mapped;
    cachedTopicsPromise = null;
    return mapped;
  })();

  return cachedTopicsPromise;
}

export const getCachedTopics = () => cachedTopics;

export async function createPoll(pollPayload = {}) {
  const token = getStoredAccessToken();
  if (!token) {
    throw new Error("No access token found. Please sign in again.");
  }

  const response = await fetch(buildApiUrl("/polls/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      ...pollPayload,
      privacy: normalizePrivacyForBackend(pollPayload?.privacy),
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Failed to create poll.");
  }

  return data;
}

export { getStoredAccessToken };

export default createPoll;
