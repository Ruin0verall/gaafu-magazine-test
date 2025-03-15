import { Link } from "react-router-dom";
import { Category, categoryLabels } from "@/lib/types";
import ArticleCard from "./ArticleCard";
import { ChevronRight } from "lucide-react";
import { memo } from "react";

interface CategorySectionProps {
  category: Category;
  articles: any[];
  isLoading: boolean;
  error: Error | null;
}

const CategorySection = memo(
  ({ category, articles, isLoading, error }: CategorySectionProps) => {
    if (isLoading) {
      return (
        <section className="py-16 first:pt-0 border-b border-gaafu-muted/20 last:border-0">
          <div className="text-center mb-10">
            <div className="h-8 w-32 bg-gaafu-muted animate-pulse rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gaafu-muted rounded-xl h-64 animate-pulse"
              ></div>
            ))}
          </div>
        </section>
      );
    }

    if (error) {
      return (
        <section className="py-16 first:pt-0 border-b border-gaafu-muted/20 last:border-0">
          <div className="text-center py-16 rounded-xl bg-gaafu-muted/50">
            <p className="text-gaafu-foreground/60 font-dhivehi text-lg mb-2">
              މައްސަލައެއް ދިމާވެއްޖެ
            </p>
            <p className="text-sm text-gaafu-foreground/40">{error.message}</p>
          </div>
        </section>
      );
    }

    if (!articles?.length) {
      return null;
    }

    const displayArticles = articles.slice(0, 4);

    return (
      <section className="py-16 first:pt-0 border-b border-gaafu-muted/20 last:border-0">
        {/* Category Title */}
        <div className="text-center mb-10">
          <h2 className="inline-block px-8 py-2.5 bg-gaafu-accent text-white rounded-full text-lg font-medium font-dhivehi shadow-sm">
            {categoryLabels[category]}
          </h2>
        </div>

        {/* Articles Grid - 2x2 on all screens except mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {displayArticles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              priority={index < 2}
            />
          ))}
        </div>

        {/* View More Link */}
        <div className="text-center mt-10">
          <Link
            to={`/category/${category}`}
            className="inline-flex items-center text-gaafu-accent hover:text-gaafu-highlight transition-colors font-medium py-2.5 px-8 rounded-full bg-gaafu-accent-light/50 hover:bg-gaafu-accent-light font-dhivehi"
          >
            {categoryLabels[category]} - އިތުރަށް ބަލާ
            <ChevronRight className="h-4 w-4 mr-1" />
          </Link>
        </div>
      </section>
    );
  }
);

export default CategorySection;
