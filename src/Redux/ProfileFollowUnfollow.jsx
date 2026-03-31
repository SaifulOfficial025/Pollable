import { buildApiUrl } from "./Config";

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

export async function followUser(userId) {
  if (!userId) throw new Error("Missing user id.");

  const response = await fetch(
    buildApiUrl(`/social/follow/${encodeURIComponent(userId)}/`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    },
  );

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.detail || body?.message || "Failed to follow user.");
  }

  return body?.data || body;
}

export async function unfollowUser(userId) {
  if (!userId) throw new Error("Missing user id.");

  const response = await fetch(
    buildApiUrl(`/social/unfollow/${encodeURIComponent(userId)}/`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    },
  );

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      body?.detail || body?.message || "Failed to unfollow user.",
    );
  }

  return body?.data || body;
}

export default {
  followUser,
  unfollowUser,
};
