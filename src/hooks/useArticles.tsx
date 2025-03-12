import { useState, useEffect, useMemo } from "react";
import { Article, Category } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { getApiUrl } from "@/lib/config";

const API_URL = getApiUrl();
const ARTICLES_PER_PAGE = 10;

// Cache for articles
let articlesCache: Article[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // Cache for 1 minute

// Common fetch options for all API calls
const fetchOptions: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  mode: "cors",
};

async function fetchArticlesWithCache(): Promise<Article[]> {
  const now = Date.now();
  if (articlesCache && now - lastFetchTime < CACHE_DURATION) {
    return articlesCache;
  }

  const response = await fetch(`${API_URL}/articles`, fetchOptions);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch articles: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  
  // Map category_id to category name
  const articlesWithCategories = data.map((article: Article) => {
    let category: Category | undefined;
    switch (article.category_id) {
      case 1:
        category = "politics";
        break;
      case 2:
        category = "business";
        break;
      case 3:
        category = "sports";
        break;
      case 4:
        category = "technology";
        break;
      case 5:
        category = "health";
        break;
    }
    return {
      ...article,
      category
    };
  });

  console.log("API Response Data with categories:", {
    firstArticle: articlesWithCategories[0],
    category: articlesWithCategories[0]?.category,
    totalArticles: articlesWithCategories.length,
  });

  articlesCache = articlesWithCategories;
  lastFetchTime = now;
  return articlesWithCategories;
}

export function useArticles(page = 1) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchArticles = async () => {
      try {
        const data = await fetchArticlesWithCache();
        if (isMounted) {
          console.log("Fetched articles:", data);
          setArticles(data);
          setTotalCount(data.length);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch articles")
          );
          setIsLoading(false);
        }
      }
    };

    fetchArticles();
    return () => {
      isMounted = false;
    };
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
    let isMounted = true;

    const fetchArticlesByCategory = async () => {
      try {
        if (category === "all") {
          if (isMounted) {
            setArticles([]);
            setIsLoading(false);
          }
          return;
        }

        const data = await fetchArticlesWithCache();
        if (!isMounted) return;

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
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch articles")
          );
          setIsLoading(false);
        }
      }
    };

    fetchArticlesByCategory();
    return () => {
      isMounted = false;
    };
  }, [category, page]);

  return {
    articles,
    isLoading,
    error,
    totalCount,
    totalPages: Math.ceil(totalCount / ARTICLES_PER_PAGE),
  };
}

// Helper function to get category ID (memoized)
const categoryMap: Record<Category, number> = {
  politics: 1,
  business: 2,
  sports: 3,
  technology: 4,
  health: 5,
};

function getCategoryId(category: Category): number {
  return categoryMap[category];
}

export function useArticleById(id: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchArticle = async () => {
      try {
        console.log('Fetching article with ID:', id);
        console.log('API URL:', `${API_URL}/articles/${id}`);
        
        // Check cache first
        if (articlesCache) {
          const cachedArticle = articlesCache.find((a) => String(a.id) === id);
          if (cachedArticle && isMounted) {
            console.log('Found article in cache:', cachedArticle);
            setArticle(cachedArticle);
            setIsLoading(false);
            return;
          }
        }

        const response = await fetch(`${API_URL}/articles/${id}`, fetchOptions);
        console.log('API Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
          if (response.status === 404) {
            console.log('Article not found in database');
            throw new Error("Article not found");
          }
          throw new Error(
            `Failed to fetch article: ${response.status} ${response.statusText}`
          );
        }
        
        const data = await response.json();
        console.log('Article data received:', data);
        
        if (isMounted) {
          setArticle(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch article")
          );
          setIsLoading(false);
        }
      }
    };

    fetchArticle();
    return () => {
      isMounted = false;
    };
  }, [id]);

  return { article, isLoading, error };
}

export function useFeaturedArticle() {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedArticle = async () => {
      try {
        const data = await fetchArticlesWithCache();
        if (isMounted) {
          console.log("Featured article data:", data);
          setArticle(data[0] || null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching featured article:", err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch featured article")
          );
          setIsLoading(false);
        }
      }
    };

    fetchFeaturedArticle();
    return () => {
      isMounted = false;
    };
  }, []);

  return { article, isLoading, error };
}
