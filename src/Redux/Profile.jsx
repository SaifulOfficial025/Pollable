import { buildApiUrl } from "./Config";
import { normalizePoll } from "./Polls/FetchPolls";

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

export async function fetchUserProfile(userId) {
  const response = await fetch(
    buildApiUrl(
      userId
        ? `/accounts/profile/?user_id=${encodeURIComponent(userId)}`
        : `/accounts/profile/`,
    ),
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    },
  );

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.detail || body?.message || "Failed to load profile.");
  }

  return body?.data || body;
}

export async function fetchFollowers(userId) {
  if (!userId) throw new Error("Missing user id.");

  const response = await fetch(
    buildApiUrl(`/social/followers/?user_id=${encodeURIComponent(userId)}`),
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    },
  );

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      body?.detail || body?.message || "Failed to load followers.",
    );
  }

  return Array.isArray(body?.data?.followers) ? body.data.followers : [];
}

export async function fetchFollowing(userId) {
  if (!userId) throw new Error("Missing user id.");

  const response = await fetch(
    buildApiUrl(`/social/following/?user_id=${encodeURIComponent(userId)}`),
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    },
  );

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      body?.detail || body?.message || "Failed to load following list.",
    );
  }

  return Array.isArray(body?.data?.following) ? body.data.following : [];
}

export async function fetchUserPolls(userId) {
  if (!userId) throw new Error("Missing user id.");

  const response = await fetch(
    buildApiUrl(
      `/polls/?action=user_polls&user_id=${encodeURIComponent(userId)}`,
    ),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    },
  );

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      body?.detail || body?.message || "Failed to load user polls.",
    );
  }

  const data = Array.isArray(body?.data) ? body.data : [];
  return data.map((p) => normalizePoll(p)).filter(Boolean);
}

export default {
  fetchUserProfile,
  fetchFollowers,
  fetchFollowing,
  fetchUserPolls,
};
