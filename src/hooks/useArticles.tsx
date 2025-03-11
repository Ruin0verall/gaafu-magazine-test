import { useState, useEffect } from "react";
import { Article, Category } from "@/lib/types";

const API_URL = "http://localhost:5000/api";

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${API_URL}/articles`);
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch articles")
        );
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return { articles, isLoading, error };
}

export function useArticlesByCategory(category: Category) {
  const { articles, isLoading, error } = useArticles();
  const filteredArticles = articles.filter((article) => {
    // Check both category name and category_id
    return (
      article.category === category ||
      article.category_id === getCategoryId(category)
    );
  });

  return { articles: filteredArticles, isLoading, error };
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
        const response = await fetch(`${API_URL}/articles/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Article not found");
          }
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        setArticle(data);
        setIsLoading(false);
      } catch (err) {
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
  const { articles, isLoading, error } = useArticles();
  const featuredArticle = articles[0] || null; // Get the most recent article as featured

  return { article: featuredArticle, isLoading, error };
}
