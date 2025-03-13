export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://havaasa-backend-production.up.railway.app/api";

// Remove /api suffix if it's already in the VITE_API_URL
export const getApiUrl = () => {
  const baseUrl = API_URL;
  return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
};
