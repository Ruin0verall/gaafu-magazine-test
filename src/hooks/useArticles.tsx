import { useState, useEffect } from "react";
import { Article, Category } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { getApiUrl } from "@/lib/config";

const API_URL = getApiUrl();
const ARTICLES_PER_PAGE = 10;

// Common fetch options for all API calls
const fetchOptions: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  mode: "cors",
};

export function useArticles(page = 1) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${API_URL}/articles`, fetchOptions);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch articles: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("Fetched articles:", data);
        setArticles(data);
        setTotalCount(data.length);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch articles")
        );
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [page]);

  return {
    articles,
    isLoading,
    error,
    totalCount,
    totalPages: Math.ceil(totalCount / ARTICLES_PER_PAGE),
  };
}

export function useArticlesByCategory(category: Category | "all", page = 1) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchArticlesByCategory = async () => {
      try {
        if (category === "all") {
          setArticles([]);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/articles`, fetchOptions);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch articles: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("All articles data:", data);

        const categoryId = getCategoryId(category);
        const filteredArticles = data.filter(
          (article: Article) => article.category_id === categoryId
        );

        console.log("Category filtering debug:", {
          category,
          categoryId,
          totalArticles: data.length,
          filteredCount: filteredArticles.length,
        });

        setArticles(filteredArticles);
        setTotalCount(filteredArticles.length);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching articles by category:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch articles")
        );
        setIsLoading(false);
      }
    };

    fetchArticlesByCategory();
  }, [category, page]);

  return {
    articles,
    isLoading,
    error,
    totalCount,
    totalPages: Math.ceil(totalCount / ARTICLES_PER_PAGE),
  };
}

// Helper function to get category ID
function getCategoryId(category: Category): number {
  const categoryMap: Record<Category, number> = {
    politics: 1,
    business: 2,
    sports: 3,
    technology: 4,
    health: 5,
  };
  return categoryMap[category];
}

export function useArticleById(id: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${API_URL}/articles/${id}`, fetchOptions);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Article not found");
          }
          throw new Error(
            `Failed to fetch article: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setArticle(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch article")
        );
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  return { article, isLoading, error };
}

export function useFeaturedArticle() {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeaturedArticle = async () => {
      try {
        const response = await fetch(`${API_URL}/articles`, fetchOptions);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch featured article: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("Featured article data:", data);
        setArticle(data[0] || null);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching featured article:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch featured article")
        );
        setIsLoading(false);
      }
    };

    fetchFeaturedArticle();
  }, []);

  return { article, isLoading, error };
}
