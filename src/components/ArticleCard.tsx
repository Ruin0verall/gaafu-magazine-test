import { Link } from "react-router-dom";
import { Article, categoryColors, categoryLabels } from "@/lib/types";
import { Calendar, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { memo, useState, useEffect } from "react";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  priority?: boolean;
}

const ArticleCard = memo(
  ({ article, featured = false, priority = false }: ArticleCardProps) => {
    const {
      id,
      title,
      excerpt,
      image_url,
      author,
      author_name,
      created_at,
      category,
    } = article;

    const [imageLoaded, setImageLoaded] = useState(false);

    // Preload image if priority
    useEffect(() => {
      if (priority) {
        const img = new Image();
        img.src = image_url;
        img.onload = () => setImageLoaded(true);
      }
    }, [image_url, priority]);

    return (
      <div
        className={`group overflow-hidden rounded-lg shadow-sm transition-all duration-500 flex flex-col bg-white ${
          featured
            ? "md:flex-row animate-fade-in"
            : "h-[280px] w-[280px] animate-slide-in"
        }`}
      >
        {/* Image Container */}
        <div
          className={`relative overflow-hidden shrink-0 ${
            featured
              ? "md:w-1/2 aspect-video md:aspect-auto rounded-t-lg md:rounded-r-none md:rounded-l-lg"
              : "h-[140px] rounded-t-lg"
          }`}
        >
          <Link to={`/article/${id}`} className="block h-full">
            <img
              src={image_url}
              alt={title}
              loading={priority ? "eager" : "lazy"}
              {...({ fetchpriority: priority ? "high" : "auto" } as any)}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{
                willChange: "transform",
                transform: "translateZ(0)",
              }}
            />
            {!imageLoaded && (
              <div
                className="absolute inset-0 bg-gaafu-muted animate-pulse"
                aria-hidden="true"
              />
            )}
          </Link>
          {category && (
            <div
              className={`absolute top-2 right-2 z-10 py-1 px-2.5 rounded-full text-sm font-medium 
              shadow-sm backdrop-blur-sm font-dhivehi ${categoryColors[category]}`}
              style={{ willChange: "opacity" }}
            >
              {categoryLabels[category]}
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className={`p-3 flex-1 flex flex-col ${
            featured
              ? "md:w-1/2 justify-center md:rounded-l-none md:rounded-r-lg"
              : "rounded-b-lg h-[140px]"
          }`}
        >
          <Link to={`/article/${id}`} className="flex-1">
            <h3
              className={`font-bold text-gaafu-foreground group-hover:text-gaafu-teal transition-colors font-dhivehi line-clamp-2 ${
                featured
                  ? "text-xl md:text-2xl mb-2"
                  : "text-base leading-6 mb-1.5"
              }`}
              style={{ willChange: "transform" }}
            >
              {title}
            </h3>
          </Link>

          {excerpt && (
            <p className="text-gaafu-foreground/80 mb-1.5 line-clamp-2 font-dhivehi text-sm leading-5 overflow-hidden text-right">
              {excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-gaafu-foreground/60 mt-auto">
            {(author || author_name) && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span className="font-dhivehi">{author || author_name}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span className="font-dhivehi">{formatDate(created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ArticleCard;
