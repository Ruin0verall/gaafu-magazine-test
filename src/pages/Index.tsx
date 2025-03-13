import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import FeaturedArticle from "@/components/FeaturedArticle";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  useFeaturedArticle,
  useArticles,
  useArticlesByCategory,
} from "@/hooks/useArticles";
import { Category, categoryLabels } from "@/lib/types";
import { ChevronRight } from "lucide-react";

const ArticlesGrid = ({
  articles,
  isLoading,
  error,
}: {
  articles: any[];
  isLoading: boolean;
  error: Error | null;
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gaafu-muted rounded-xl h-80 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 rounded-xl bg-gaafu-muted/50 my-8">
        <p className="text-gaafu-foreground/60 font-dhivehi text-lg mb-2">
          މައްސަލައެއް ދިމާވެއްޖެ
        </p>
        <p className="text-sm text-gaafu-foreground/40">{error.message}</p>
      </div>
    );
  }

  if (!articles?.length) {
    return (
      <div className="text-center py-16 rounded-xl bg-gaafu-muted/50 my-8">
        <p className="text-gaafu-foreground/60 font-dhivehi text-lg">
          މި ބަޔަށް ނިއުސް ނެތް
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

const Index = () => {
  const {
    article: featuredArticle,
    isLoading: featuredLoading,
    error: featuredError,
  } = useFeaturedArticle();
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all"
  );
  const {
    articles: allArticles,
    isLoading: allArticlesLoading,
    error: allArticlesError,
  } = useArticles();
  const {
    articles: categoryArticles,
    isLoading: categoryLoading,
    error: categoryError,
  } = useArticlesByCategory(selectedCategory as Category);
  const [isVisible, setIsVisible] = useState(false);

  // Debug logging for category changes
  useEffect(() => {
    console.log("Category changed:", {
      selectedCategory,
      articles: selectedCategory === "all" ? allArticles : categoryArticles,
    });
  }, [selectedCategory, allArticles, categoryArticles]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Use either all articles or filtered articles based on selection
  const articles = selectedCategory === "all" ? allArticles : categoryArticles;
  const isLoading =
    selectedCategory === "all" ? allArticlesLoading : categoryLoading;
  const error = selectedCategory === "all" ? allArticlesError : categoryError;

  return (
    <div
      className={`min-h-screen flex flex-col transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Header />

      <ErrorBoundary>
        {/* Hero Section with Featured Article */}
        <section className="pt-16 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="max-w-7xl mx-auto">
              {featuredLoading ? (
                <div className="h-[65vh] min-h-[450px] bg-gaafu-muted animate-pulse flex items-center justify-center rounded-2xl">
                  <p className="text-gaafu-foreground/50">ލޯޑް ވަނީ...</p>
                </div>
              ) : featuredError ? (
                <div className="h-[65vh] min-h-[450px] bg-gaafu-muted flex items-center justify-center rounded-2xl">
                  <div className="text-center">
                    <p className="text-gaafu-foreground/50 mb-2">
                      އާޓިކަލް ލޯޑް ނުކުރެވުނު
                    </p>
                    <p className="text-sm text-gaafu-foreground/40">
                      {featuredError.message}
                    </p>
                  </div>
                </div>
              ) : featuredArticle ? (
                <FeaturedArticle article={featuredArticle} />
              ) : (
                <div className="h-[65vh] min-h-[450px] bg-gaafu-muted flex items-center justify-center rounded-2xl">
                  <p className="text-gaafu-foreground/50">
                    ފީޗާޑް އާޓިކަލް ނެތް
                  </p>
                </div>
              )}
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
                    className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm font-dhivehi ${
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
                      className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm font-dhivehi ${
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
              <ErrorBoundary>
                <ArticlesGrid
                  articles={articles}
                  isLoading={isLoading}
                  error={error}
                />
              </ErrorBoundary>

              {/* More News Link */}
              <div className="text-center mt-12">
                <a
                  href="/latest"
                  className="inline-flex items-center text-gaafu-accent hover:text-gaafu-highlight transition-colors font-medium py-2 px-6 rounded-full bg-gaafu-accent-light/50 hover:bg-gaafu-accent-light font-dhivehi"
                >
                  އިތުރު ހަބަރުތައް
                  <ChevronRight className="h-4 w-4 mr-1" />
                </a>
              </div>
            </div>
          </div>
        </main>
      </ErrorBoundary>

      <Footer />
    </div>
  );
};

export default Index;
