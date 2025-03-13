import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

async function fetchArticle(id: string) {
  const response = await fetch(`${API_URL}/articles/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

async function fetchArticles() {
  const response = await fetch(`${API_URL}/articles`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useArticleById(id: string) {
  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticle(id),
    enabled: !!id,
  });

  return { article, isLoading, error };
}

export function useArticles() {
  const {
    data: articles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  return { articles, isLoading, error };
}

// Prefetch function for SSR or early loading
export async function prefetchArticle(id: string) {
  const article = await fetchArticle(id);
  return article;
}

// Prefetch multiple articles
export async function prefetchArticles() {
  const articles = await fetchArticles();
  return articles;
}
