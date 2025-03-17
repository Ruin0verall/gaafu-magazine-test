import { useState, useEffect, useMemo, useCallback } from "react";
import { Article, Category } from "@/lib/types";
import { getApiUrl } from "@/lib/config";
import useApi from "./useApi";

const API_URL = getApiUrl();
const ARTICLES_PER_PAGE = 10;

// Cache for articles
let articlesCache: Article[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // Cache for 30 seconds

// Common fetch options for all API calls
const fetchOptions: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  mode: "cors",
};

// Add timestamp to URL to bust cache
async function fetchArticlesWithCache(): Promise<Article[]> {
  const now = Date.now();
  if (articlesCache && now - lastFetchTime < CACHE_DURATION) {
    return articlesCache;
  }

  const timestamp = new Date().getTime();
  const response = await fetch(`${API_URL}/articles?_t=${timestamp}`, {
    ...fetchOptions,
    headers: {
      ...fetchOptions.headers,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch articles: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid response format: expected an array");
  }

  // Map category_id to category name
  const articlesWithCategories = data.map((article: Article) => ({
    ...article,
    category: getCategoryFromId(article.category_id),
  }));

  articlesCache = articlesWithCategories;
  lastFetchTime = now;
  return articlesWithCategories;
}

// Helper function to get category from ID
function getCategoryFromId(categoryId: number): Category | undefined {
  const categories: Record<number, Category> = {
    1: "politics",
    2: "business",
    3: "sports",
    4: "technology",
    5: "health",
    6: "world",
    7: "habaru",
  };
  return categories[categoryId];
}

// Add cache invalidation function
export function invalidateArticlesCache() {
  articlesCache = null;
  lastFetchTime = 0;
}

// Update useArticles to include refetch functionality
export function useArticles(page = 1) {
  const [forceUpdate, setForceUpdate] = useState(0);

  const {
    data: articles,
    isLoading,
    error,
  } = useApi<Article[]>(() => fetchArticlesWithCache(), [page, forceUpdate], {
    initialData: [],
  });

  const refetch = useCallback(() => {
    invalidateArticlesCache();
    setForceUpdate((prev) => prev + 1);
  }, []);

  return {
    articles: articles || [],
    isLoading,
    error,
    refetch,
    totalCount: articles?.length || 0,
    totalPages: Math.ceil((articles?.length || 0) / ARTICLES_PER_PAGE),
  };
}

// Update useArticlesByCategory to include refetch functionality
export function useArticlesByCategory(category: Category | "all", page = 1) {
  const [forceUpdate, setForceUpdate] = useState(0);

  const {
    data: allArticles,
    isLoading,
    error,
  } = useApi<Article[]>(
    () => fetchArticlesWithCache(),
    [category, page, forceUpdate],
    {
      initialData: [],
    }
  );

  const filteredArticles = useMemo(() => {
    if (category === "all") return allArticles || [];
    const categoryId = getCategoryId(category);
    return (allArticles || []).filter(
      (article: Article) => article.category_id === categoryId
    );
  }, [allArticles, category]);

  const refetch = useCallback(() => {
    invalidateArticlesCache();
    setForceUpdate((prev) => prev + 1);
  }, []);

  return {
    articles: filteredArticles,
    isLoading,
    error,
    refetch,
    totalCount: filteredArticles.length,
    totalPages: Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE),
  };
}

// Helper function to get category ID (memoized)
const categoryMap: Record<Category, number> = {
  politics: 1,
  business: 2,
  sports: 3,
  technology: 4,
  health: 5,
  world: 6,
  habaru: 7,
};

function getCategoryId(category: Category): number {
  return categoryMap[category];
}

export function useArticleById(id: string) {
  const {
    data: article,
    isLoading,
    error,
  } = useApi<Article | null>(
    async () => {
      // Check cache first
      if (articlesCache) {
        const cachedArticle = articlesCache.find((a) => String(a.id) === id);
        if (cachedArticle) {
          return cachedArticle;
        }
      }

      const response = await fetch(`${API_URL}/articles/${id}`, fetchOptions);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(
          `Failed to fetch article: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    },
    [id],
    { initialData: null }
  );

  return { article, isLoading, error };
}

export function useFeaturedArticle() {
  const {
    data: articles,
    isLoading,
    error,
  } = useApi<Article[]>(() => fetchArticlesWithCache(), [], {
    initialData: [],
  });

  return {
    article: articles?.[0] || null,
    isLoading,
    error,
  };
}
