import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useArticlesByCategory } from "@/hooks/useArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { Category as CategoryType, categoryLabels } from "@/lib/types";

const Category = () => {
  const { category } = useParams<{ category: string }>();
  const isValidCategory = (cat: string): cat is CategoryType => {
    return Object.keys(categoryLabels).includes(cat);
  };

  // Validate category parameter
  if (!category || !isValidCategory(category)) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4 font-dhivehi">
            ކެޓަގަރީ ނުފެނުނު
          </h1>
          <p className="mb-6 font-dhivehi">
            ކެޓަގަރީ ލިބެން ނެތް ނުވަތަ ކުށެއް ދިމާވެއްޖެ
          </p>
          <Link
            to="/"
            className="text-gaafu-accent hover:text-gaafu-highlight font-dhivehi"
          >
            މައި ސަފްޙާއަށް ދާންވީތަ؟
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { articles, isLoading, error } = useArticlesByCategory(category);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, [category]);

  const categoryName = categoryLabels[category];

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4 font-dhivehi">
            ކުށެއް ދިމާވެއްޖެ
          </h1>
          <p className="mb-6 font-dhivehi">
            މަޢުލޫމާތު ހޯދުމުގައި މައްސަލައެއް ދިމާވެއްޖެ
          </p>
          <Link
            to="/"
            className="text-gaafu-accent hover:text-gaafu-highlight font-dhivehi"
          >
            މައި ސަފްޙާއަށް ދާންވީތަ؟
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Category Header */}
            <div className="mb-12 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 font-dhivehi">
                {categoryName}
              </h1>
              <div className="h-1 w-24 bg-gaafu-accent mx-auto"></div>
            </div>

            {/* Articles */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 place-items-center">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gaafu-muted rounded-lg h-[280px] w-[280px] animate-pulse"
                  ></div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 place-items-center">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gaafu-foreground/60 mb-4 font-dhivehi">
                  މި ކެޓަގަރީގައި މަޢުލޫމާތެއް ނެތް
                </p>
                <Link
                  to="/"
                  className="text-gaafu-accent hover:text-gaafu-highlight font-dhivehi"
                >
                  މައި ސަފްޙާއަށް ދާންވީތަ؟
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Category;
