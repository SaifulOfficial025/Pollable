import { buildApiUrl } from "../Config";

export async function signInUser({ phone, password }) {
  const response = await fetch(buildApiUrl("/accounts/login/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.errors?.detail ||
      "Unable to sign in. Please try again.";
    throw new Error(message);
  }

  return data;
}

export function saveSignInData(authResponse) {
  const payload = authResponse?.data || {};

  localStorage.setItem("authResponse", JSON.stringify(authResponse || {}));

  if (payload?.access) {
    localStorage.setItem("accessToken", payload.access);
  }

  if (payload?.refresh) {
    localStorage.setItem("refreshToken", payload.refresh);
  }

  localStorage.setItem("isLoggedIn", "true");
}
