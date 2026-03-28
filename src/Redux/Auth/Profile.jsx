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

export async function fetchProfile() {
  const token = getStoredAccessToken();
  if (!token) {
    throw new Error("No access token found. Please sign in again.");
  }

  const response = await fetch(buildApiUrl("/accounts/profile/"), {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.detail || data?.message || "Failed to fetch profile data.",
    );
  }

  return data;
}

export async function updateProfile(profileForm) {
  const formData = new FormData();

  if (profileForm?.date_of_birth) {
    formData.append("date_of_birth", profileForm.date_of_birth);
  }
  if (profileForm?.gender) {
    formData.append("gender", profileForm.gender);
  }
  if (profileForm?.ethnicity) {
    formData.append("ethnicity", profileForm.ethnicity);
  }
  if (profileForm?.biodata) {
    formData.append("biodata", profileForm.biodata);
  }
  if (profileForm?.name) {
    formData.append("name", profileForm.name);
  }
  if (profileForm?.topics) {
    formData.append("topics", JSON.stringify(profileForm.topics));
  }
  if (profileForm?.email) {
    formData.append("email", profileForm.email);
  }
  if (profileForm?.image) {
    formData.append("image", profileForm.image);
  }

  const response = await fetch(buildApiUrl("/accounts/profile/"), {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.detail || data?.message || "Failed to update profile.",
    );
  }

  return data;
}
