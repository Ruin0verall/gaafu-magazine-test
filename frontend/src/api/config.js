const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const getArticles = async () => {
  const response = await fetch(`${BASE_URL}/articles`);
  return response.json();
};
