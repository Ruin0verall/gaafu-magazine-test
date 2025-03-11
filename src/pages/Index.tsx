import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import FeaturedArticle from "@/components/FeaturedArticle";
import { useFeaturedArticle, useArticles } from "@/hooks/useArticles";
import { Category, categoryLabels } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

const Index = () => {
  const { article: featuredArticle, isLoading: featuredLoading } =
    useFeaturedArticle();
  const { articles, isLoading: articlesLoading } = useArticles();
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all"
  );
  const [isVisible, setIsVisible] = useState(false);

  const {
    data: articlesData,
    isLoading: queryLoading,
    error,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
        throw error;
      }

      return data || [];
    },
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredArticles =
    selectedCategory === "all"
      ? articlesData
      : articlesData.filter(
          (article: any) =>
            article.category === selectedCategory ||
            article.category_id === getCategoryId(selectedCategory as Category)
        );

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

  if (queryLoading) {
    return <div className="p-4">Loading articles...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading articles: {(error as Error).message}
      </div>
    );
  }

  if (!articlesData?.length) {
    return <div className="p-4">No articles found.</div>;
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Header />

      {/* Hero Section with Featured Article */}
      <section className="pt-16 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            {featuredLoading ? (
              <div className="h-[65vh] min-h-[450px] bg-gaafu-muted animate-pulse flex items-center justify-center rounded-2xl">
                <p className="text-gaafu-foreground/50">ލޯޑް ވަނީ...</p>
              </div>
            ) : featuredArticle ? (
              <FeaturedArticle article={featuredArticle} />
            ) : null}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Category Filter */}
            <div className="mb-8 overflow-x-auto">
              <div className="flex space-x-2 space-x-reverse pb-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm ${
                    selectedCategory === "all"
                      ? "bg-gaafu-accent text-white"
                      : "bg-gaafu-muted text-gaafu-foreground hover:bg-gaafu-accent-light"
                  }`}
                >
                  ހުރިހާ ބައިތައް
                </button>

                {Object.entries(categoryLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as Category)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm ${
                      selectedCategory === key
                        ? "bg-gaafu-accent text-white"
                        : "bg-gaafu-muted text-gaafu-foreground hover:bg-gaafu-accent-light"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gaafu-muted rounded-xl h-80 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredArticles.map((article: any) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {article.image_url && (
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2">
                          {article.title}
                        </h2>
                        <p className="text-gray-600 line-clamp-3">
                          {article.content}
                        </p>
                        <div className="mt-4 text-sm text-gray-500">
                          {new Date(article.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-16 rounded-xl bg-gaafu-muted/50 my-8">
                    <p className="text-gaafu-foreground/60 font-dhivehi text-lg">
                      މި ބަޔަށް ނިއުސް ނެތް
                    </p>
                  </div>
                )}
              </>
            )}

            {/* More News Link */}
            <div className="text-center mt-12">
              <a
                href="/latest"
                className="inline-flex items-center text-gaafu-accent hover:text-gaafu-highlight transition-colors font-medium py-2 px-6 rounded-full bg-gaafu-accent-light/50 hover:bg-gaafu-accent-light"
              >
                އިތުރު ހަބަރުތައް
                <ChevronRight className="h-4 w-4 mr-1" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
