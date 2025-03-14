import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useArticles } from "@/hooks/useArticles";
import SEO from "@/components/SEO";
import { ChevronUp } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const Latest = () => {
  const { articles, isLoading, error } = useArticles();
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sort articles by creation date (newest first)
  const sortedArticles = articles?.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const displayedArticles = sortedArticles?.slice(0, displayCount);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      // Show scroll to top button when user scrolls down 500px
      setShowScrollTop(window.scrollY > 500);

      // Load more articles when near bottom
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1000
      ) {
        setDisplayCount((prev) =>
          Math.min(prev + ITEMS_PER_PAGE, articles?.length || 0)
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [articles?.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <SEO
        title="އެންމެ ފަހުގެ ހަބަރުތައް - ގާފު މަޖައްލާ"
        description="ގާފު މަޖައްލާގެ އެންމެ ފަހުގެ ހަބަރުތައް"
        type="website"
      />

      <Header />

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Page Title */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gaafu-foreground mb-4 font-dhivehi">
                އެންމެ ފަހުގެ ހަބަރުތައް
              </h1>
              <p className="text-gaafu-foreground/60 font-dhivehi">
                އެންމެ ފަހުން ޝާއިޢުކުރެވުނު ހަބަރުތައް
              </p>
            </div>

            <ErrorBoundary>
              {isLoading ? (
                // Loading state
                <div className="space-y-8">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gaafu-muted rounded-xl h-64 animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : error ? (
                // Error state
                <div className="text-center py-16 rounded-xl bg-gaafu-muted/50">
                  <p className="text-gaafu-foreground/60 font-dhivehi text-lg mb-2">
                    މައްސަލައެއް ދިމާވެއްޖެ
                  </p>
                  <p className="text-sm text-gaafu-foreground/40">
                    {error.message}
                  </p>
                </div>
              ) : !displayedArticles?.length ? (
                // Empty state
                <div className="text-center py-16 rounded-xl bg-gaafu-muted/50">
                  <p className="text-gaafu-foreground/60 font-dhivehi text-lg">
                    މިވަގުތު ހަބަރެއް ނެތް
                  </p>
                </div>
              ) : (
                // Articles list
                <div className="space-y-8">
                  {displayedArticles.map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      featured={true}
                      priority={index < 2}
                    />
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {!isLoading && displayCount < (articles?.length || 0) && (
                <div className="text-center mt-12">
                  <button
                    onClick={() =>
                      setDisplayCount((prev) =>
                        Math.min(prev + ITEMS_PER_PAGE, articles?.length || 0)
                      )
                    }
                    className="inline-flex items-center text-gaafu-accent hover:text-gaafu-highlight transition-colors font-medium py-2 px-6 rounded-full bg-gaafu-accent-light/50 hover:bg-gaafu-accent-light font-dhivehi"
                  >
                    އިތުރު ހަބަރުތައް
                  </button>
                </div>
              )}
            </ErrorBoundary>
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-gaafu-accent text-white shadow-lg hover:bg-gaafu-highlight transition-all transform ${
          showScrollTop
            ? "translate-y-0 opacity-100"
            : "translate-y-16 opacity-0"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-6 w-6" />
      </button>

      <Footer />
    </div>
  );
};

export default Latest;
