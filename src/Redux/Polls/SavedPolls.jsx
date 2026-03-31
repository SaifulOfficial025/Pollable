import { buildApiUrl } from "../Config";
import { normalizePoll } from "./FetchPolls";

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

export async function fetchSavedPolls() {
  const response = await fetch(buildApiUrl(`/polls/?action=bookmark_polls`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      body?.detail || body?.message || "Failed to load saved polls.",
    );
  }

  const data = Array.isArray(body?.data) ? body.data : [];
  return data.map((p) => normalizePoll(p)).filter(Boolean);
}

export default { fetchSavedPolls };
