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

async function fetchFeaturedArticle() {
  const response = await fetch(`${API_URL}/articles/featured`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

async function fetchArticlesByCategory(category: string) {
  const response = await fetch(`${API_URL}/articles/category/${category}`);
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

export function useFeaturedArticle() {
  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featured-article"],
    queryFn: fetchFeaturedArticle,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  return { article, isLoading, error };
}

export function useArticlesByCategory(category: string) {
  const {
    data: articles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articles", "category", category],
    queryFn: () => fetchArticlesByCategory(category),
    enabled: !!category,
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

// Prefetch featured article
export async function prefetchFeaturedArticle() {
  const article = await fetchFeaturedArticle();
  return article;
}

// Prefetch articles by category
export async function prefetchArticlesByCategory(category: string) {
  const articles = await fetchArticlesByCategory(category);
  return articles;
}
