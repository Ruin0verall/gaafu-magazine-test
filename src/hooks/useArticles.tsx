import { useState, useEffect } from "react";
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

  try {
    console.log("Fetching articles from API:", `${API_URL}/articles`);
    const response = await fetch(`${API_URL}/articles`, fetchOptions);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch articles: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    console.log("Raw data from API:", data);

    // Map category_id to category name
    const articlesWithCategories = data.map((article: Article) => {
      // Ensure category_id is treated as a number
      const categoryId = Number(article.category_id);
      let category: Category | undefined;

      // Map category_id to category
      switch (categoryId) {
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
        default:
          console.warn(
            `Unknown category_id: ${categoryId} for article ${article.id}`
          );
          break;
      }

      console.log(
        `Mapping article ${article.id}: category_id=${categoryId} -> category=${category}`
      );
      return {
        ...article,
        category_id: categoryId, // Ensure it's stored as a number
        category,
      };
    });

    console.log("Mapped articles with categories:", articlesWithCategories);
    articlesCache = articlesWithCategories;
    lastFetchTime = now;
    return articlesWithCategories;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
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
        console.log("Fetching articles for category:", category);
        const data = await fetchArticlesWithCache();
        if (!isMounted) return;

        let filteredArticles = data;

        if (category !== "all") {
          const categoryId = getCategoryId(category);
          console.log("Filtering by category ID:", categoryId);

          filteredArticles = data.filter((article: Article) => {
            // Ensure we're comparing numbers with numbers
            const matches = Number(article.category_id) === categoryId;
            console.log(
              `Article ${article.id}: category_id=${
                article.category_id
              } (${typeof article.category_id}) vs ${categoryId} (${typeof categoryId}), matches=${matches}`
            );
            return matches;
          });
        }

        // Sort by created_at in descending order
        filteredArticles.sort(
          (a: Article, b: Article) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        console.log("Category filtering results:", {
          category,
          categoryId: category !== "all" ? getCategoryId(category) : "all",
          totalArticles: data.length,
          filteredCount: filteredArticles.length,
          filteredArticles: filteredArticles.map((a) => ({
            id: a.id,
            category_id: a.category_id,
            category: a.category,
          })),
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

export function useArticleById(id: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchArticle = async () => {
      try {
        console.log("Fetching article with ID:", id);
        console.log("API URL:", `${API_URL}/articles/${id}`);

        // Check cache first
        if (articlesCache) {
          const cachedArticle = articlesCache.find((a) => String(a.id) === id);
          if (cachedArticle && isMounted) {
            console.log("Found article in cache:", cachedArticle);
            setArticle(cachedArticle);
            setIsLoading(false);
            return;
          }
        }

        const response = await fetch(`${API_URL}/articles/${id}`, fetchOptions);
        console.log("API Response:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });

        if (!response.ok) {
          if (response.status === 404) {
            console.log("Article not found in database");
            throw new Error("Article not found");
          }
          throw new Error(
            `Failed to fetch article: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Article data received:", data);

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
        if (isMounted && data.length > 0) {
          // Sort by created_at in descending order and take the most recent article
          const sortedArticles = [...data].sort(
            (a: Article, b: Article) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          const mostRecentArticle = sortedArticles[0];
          console.log(
            "Selected most recent article as featured:",
            mostRecentArticle
          );
          setArticle(mostRecentArticle);
          setIsLoading(false);
        } else {
          console.log("No articles found for featuring");
          setArticle(null);
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

// Helper function to get category ID
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
