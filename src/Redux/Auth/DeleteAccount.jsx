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

export async function deleteAccount() {
  const token = getStoredAccessToken();
  if (!token) {
    throw new Error("No access token found. Please sign in again.");
  }

  const response = await fetch(buildApiUrl("/accounts/profile/"), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.errors?.detail ||
      "Failed to delete account.";
    throw new Error(message);
  }

  return data;
}
