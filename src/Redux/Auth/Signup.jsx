import { buildApiUrl } from "../Config";

export async function signUpUser({ username, name, phone, password }) {
  const response = await fetch(buildApiUrl("/accounts/register/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, name, phone, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.errors?.detail ||
      "Unable to sign up. Please try again.";
    throw new Error(message);
  }

  return data;
}

export function savePendingRegistration(payload) {
  const pending = {
    phone: payload?.phone || "",
    name: payload?.name || "",
    username: payload?.username || "",
  };

  localStorage.setItem("pendingRegistration", JSON.stringify(pending));
}
