import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedArticle from "@/components/FeaturedArticle";
import CategorySection from "@/components/CategorySection";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useFeaturedArticle, useArticlesByCategory } from "@/hooks/useArticles";
import { Category, categoryLabels } from "@/lib/types";
import SEO from "@/components/SEO";
import AdSpace from "@/components/AdSpace";

// Define the order of categories you want to display
const CATEGORY_ORDER: Category[] = [
  "habaru",
  "world",
  "politics",
  "sports",
  "business",
  "technology",
  "health",
];

const Index = () => {
  const {
    article: featuredArticle,
    isLoading: featuredLoading,
    error: featuredError,
  } = useFeaturedArticle();
  const [isVisible, setIsVisible] = useState(false);

  // Create a map of category data
  const categoryData = Object.fromEntries(
    CATEGORY_ORDER.map((category) => {
      const { articles, isLoading, error } = useArticlesByCategory(category);
      return [category, { articles, isLoading, error }];
    })
  );

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <SEO
        title="ގާފު މަޖައްލާ"
        description="ގާފު އަކީ ދިވެހި ބަހުން ހިންގާ ހަބަރާއި މަޢުލޫމާތު ފޯރުކޮށްދޭ ފަރާތެކެވެ"
        type="website"
      />

      <Header />

      <div className="w-full pt-20 pb-4 px-2 bg-white">
        <AdSpace />
      </div>

      <ErrorBoundary>
        {/* Hero Section with Featured Article */}
        <section className="pt-8 px-2 md:px-6">
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
        <main className="flex-grow py-8 md:py-12">
          <div className="container mx-auto px-2 md:px-6">
            <div className="max-w-7xl mx-auto">
              {/* Category Sections */}
              {CATEGORY_ORDER.map((category, index) => (
                <>
                  <CategorySection
                    key={category}
                    category={category}
                    articles={categoryData[category].articles || []}
                    isLoading={categoryData[category].isLoading}
                    error={categoryData[category].error}
                  />
                  {/* Add AdSpace after habaru and business categories */}
                  {(index === 0 || index === 4) && <AdSpace />}
                </>
              ))}

              {/* Latest News Link */}
              <div className="text-center mt-8 md:mt-12">
                <Link
                  to="/latest"
                  className="inline-flex items-center text-gaafu-accent hover:text-gaafu-highlight transition-colors font-medium py-2.5 md:py-3 px-6 md:px-8 rounded-full bg-gaafu-accent-light/50 hover:bg-gaafu-accent-light font-dhivehi text-base md:text-lg"
                >
                  އެންމެ ފަހުގެ ހުރިހާ ހަބަރުތައް
                </Link>
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
