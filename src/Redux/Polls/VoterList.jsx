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

export async function fetchVotePeople({
  pollId,
  page = 1,
  pageSize = 20,
  optionId,
} = {}) {
  if (!pollId) throw new Error("Missing poll id.");

  const token = getStoredAccessToken();
  if (!token) throw new Error("Please sign in to view voters.");

  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  const response = await fetch(
    buildApiUrl(
      `/polls/${encodeURIComponent(pollId)}/vote-people/?${params.toString()}`,
    ),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      body?.detail || body?.message || "Failed to load vote people.",
    );
  }

  const people = Array.isArray(body?.data?.people) ? body.data.people : [];
  const normalizedOptionId =
    optionId === undefined || optionId === null ? null : String(optionId);

  const filteredPeople =
    normalizedOptionId === null
      ? people
      : people.filter(
          (person) => String(person?.option_id) === normalizedOptionId,
        );

  return {
    people: filteredPeople,
    pagination: body?.data?.pagination || null,
    raw: body,
  };
}

export default {
  fetchVotePeople,
};
