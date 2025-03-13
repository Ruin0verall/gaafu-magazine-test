import { useState, useEffect, useMemo } from "react";
import { Article, Category } from "@/lib/types";
import { getApiUrl } from "@/lib/config";
import useApi from "./useApi";

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
    console.log("Returning cached articles:", articlesCache);
    return articlesCache;
  }

  const response = await fetch(`${API_URL}/articles`, fetchOptions);
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
      case 6:
        category = "world";
        break;
      case 7:
        category = "habaru";
        break;
    }

    if (!category) {
      console.warn(
        `Unknown category_id: ${article.category_id} for article ${article.id}`
      );
    }

    return {
      ...article,
      category,
    };
  });

  articlesCache = articlesWithCategories;
  lastFetchTime = now;
  return articlesWithCategories;
}

export function useArticles(page = 1) {
  const {
    data: articles,
    isLoading,
    error,
  } = useApi<Article[]>(() => fetchArticlesWithCache(), [page], {
    initialData: [],
  });

  return {
    articles: articles || [],
    isLoading,
    error,
    totalCount: articles?.length || 0,
    totalPages: Math.ceil((articles?.length || 0) / ARTICLES_PER_PAGE),
  };
}

export function useArticlesByCategory(category: Category | "all", page = 1) {
  const {
    data: allArticles,
    isLoading,
    error,
  } = useApi<Article[]>(() => fetchArticlesWithCache(), [category, page], {
    initialData: [],
  });

  const filteredArticles = useMemo(() => {
    if (category === "all") return allArticles || [];
    const categoryId = getCategoryId(category);
    return (allArticles || []).filter(
      (article: Article) => article.category_id === categoryId
    );
  }, [allArticles, category]);

  return {
    articles: filteredArticles,
    isLoading,
    error,
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
