import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import FeaturedArticle from "@/components/FeaturedArticle";
import { useFeaturedArticle, useArticles } from "@/hooks/useArticles";
import { Category, categoryLabels } from "@/lib/types";
import { ChevronRight } from "lucide-react";

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
    isLoading: articlesLoading,
    error: articlesError,
  } = useArticles();
  const [filteredArticles, setFilteredArticles] = useState(allArticles);
  const [isVisible, setIsVisible] = useState(false);

  // Filter articles when category or allArticles changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredArticles(allArticles);
    } else {
      const filtered = allArticles.filter(
        (article) => article.category === selectedCategory
      );
      setFilteredArticles(filtered);
    }

    console.log("Category changed:", {
      selectedCategory,
      allArticlesCount: allArticles.length,
      filteredCount: filteredArticles.length,
    });
  }, [selectedCategory, allArticles]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
            ) : featuredError ? (
              <div className="h-[65vh] min-h-[450px] bg-gaafu-muted flex items-center justify-center rounded-2xl">
                <p className="text-gaafu-foreground/50">
                  އާޓިކަލް ލޯޑް ނުކުރެވުނު
                </p>
              </div>
            ) : featuredArticle ? (
              <FeaturedArticle article={featuredArticle} />
            ) : (
              <div className="h-[65vh] min-h-[450px] bg-gaafu-muted flex items-center justify-center rounded-2xl">
                <p className="text-gaafu-foreground/50">ފީޗާޑް އާޓިކަލް ނެތް</p>
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
            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gaafu-muted rounded-xl h-80 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : articlesError ? (
              <div className="text-center py-16">
                <p className="text-gaafu-foreground/60 font-dhivehi text-lg">
                  އާޓިކަލްތައް ލޯޑް ނުކުރެވުނު
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
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
                className="inline-flex items-center text-gaafu-accent hover:text-gaafu-highlight transition-colors font-medium py-2 px-6 rounded-full bg-gaafu-accent-light/50 hover:bg-gaafu-accent-light font-dhivehi"
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
