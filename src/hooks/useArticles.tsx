import { useQuery } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/config";
import { useState, useEffect } from "react";
import { Article, Category } from "@/lib/types";

export const useArticles = () => {
  const fetchArticles = async (): Promise<Article[]> => {
    try {
      const response = await fetch(`${getApiUrl()}/articles`);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }
  };

  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });
};

export const useFeaturedArticle = () => {
  const { data: articles, ...rest } = useArticles();

  return {
    article: articles?.[0],
    ...rest,
  };
};

export const useArticle = (id: string) => {
  const fetchArticle = async (): Promise<Article> => {
    try {
      const response = await fetch(`${getApiUrl()}/articles/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch article");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching article:", error);
      throw error;
    }
  };

  return useQuery<Article>({
    queryKey: ["article", id],
    queryFn: fetchArticle,
    enabled: !!id,
  });
};

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
        const response = await fetch(`${getApiUrl()}/articles/${id}`);
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
