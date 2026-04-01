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

export async function deletePoll(pollId) {
  if (!pollId) {
    throw new Error("Poll identifier is required.");
  }

  const token = getStoredAccessToken();
  if (!token) {
    throw new Error("No access token found. Please sign in again.");
  }

  const response = await fetch(buildApiUrl("/polls/"), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ poll_id: pollId }),
  });

  if (response.status === 204) {
    return { success: true };
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Failed to delete poll.");
  }

  return data;
}

export default deletePoll;
