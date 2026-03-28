import { buildApiUrl } from "../Config";

const parseErrorMessage = (data) =>
  data?.detail || data?.message || data?.errors?.detail || "Request failed.";

export async function verifyOtp({ phone, otp }) {
  const response = await fetch(buildApiUrl("/accounts/otp-verify/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "account_verify", phone, otp }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(parseErrorMessage(data));
  }

  return data;
}

export async function resendOtp({ phone }) {
  const response = await fetch(buildApiUrl("/accounts/otp-verify/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "resend_otp", phone }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(parseErrorMessage(data));
  }

  return data;
}
