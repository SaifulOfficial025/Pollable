export const API_BASE_URL = "http://10.10.13.95:8500/api/v1";

export const buildApiUrl = (path = "") => {
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${API_BASE_URL}${normalizedPath}`;
};

