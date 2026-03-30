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

export async function fetchComments(pollId) {
  if (!pollId) throw new Error("Missing poll identifier.");

  const response = await fetch(buildApiUrl(`/polls/${pollId}/comment/`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data?.detail || data?.message || "Failed to load comments.",
    );
  }

  return data?.data || [];
}

export async function createComment({
  pollId,
  content,
  parent_comment_id = null,
  is_anonymous = false,
}) {
  if (!pollId) throw new Error("Missing poll identifier.");
  if (!content || !content.trim()) throw new Error("Comment cannot be empty.");

  const response = await fetch(buildApiUrl(`/polls/${pollId}/comment/`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      content,
      parent_comment_id,
      is_anonymous,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Failed to post comment.");
  }

  // API returns the created comment or a success wrapper; prefer data.data if present
  return data?.data || data;
}

export default { fetchComments, createComment };
