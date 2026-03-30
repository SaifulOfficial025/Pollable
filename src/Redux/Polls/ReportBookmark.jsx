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

export async function bookmarkPoll(pollId) {
  if (!pollId) throw new Error("Missing poll identifier.");

  const response = await fetch(buildApiUrl(`/polls/${pollId}/bookmark/`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      body?.detail || body?.message || "Failed to bookmark poll.",
    );
  }

  return body?.data || body;
}

export async function reportPoll(pollId, reason) {
  if (!pollId) throw new Error("Missing poll identifier.");
  if (!reason || !reason.trim())
    throw new Error("Reason is required to report.");

  const response = await fetch(buildApiUrl(`/polls/${pollId}/report/`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ reason }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.detail || body?.message || "Failed to report poll.");
  }

  return body?.data || body;
}

export default { bookmarkPoll, reportPoll };
