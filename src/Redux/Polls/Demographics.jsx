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

const normalizeEntry = (entry) => ({
  label: entry?.label || "",
  count: Number(entry?.count) || 0,
  percentage:
    typeof entry?.percentage === "number"
      ? entry.percentage
      : Number(entry?.percent) || 0,
});

const normalizeGroup = (items) =>
  Array.isArray(items) ? items.map((item) => normalizeEntry(item)) : [];

export async function fetchPollDemographics(pollId) {
  if (!pollId) throw new Error("Missing poll identifier.");

  const response = await fetch(buildApiUrl(`/polls/${pollId}/demographics/`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      body?.detail || body?.message || "Failed to load demographics.",
    );
  }

  const data = body?.data || {};

  return {
    id: data.id,
    total_votes: Number(data.total_votes) || 0,
    age: normalizeGroup(data.age),
    gender: normalizeGroup(data.gender),
    ethnicity: normalizeGroup(data.ethnicity),
  };
}

export default { fetchPollDemographics };
