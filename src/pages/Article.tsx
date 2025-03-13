import { useEffect, useState, Suspense, lazy } from "react";
import { useParams, Link } from "react-router-dom";
import { useArticleById } from "@/hooks/useArticles";
import { Calendar, User, Share2 } from "lucide-react";
import { categoryColors, categoryLabels } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Helmet } from "react-helmet-async";
import OptimizedImage from "@/components/OptimizedImage";

// Lazy load components
const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="animate-pulse bg-gaafu-muted h-16"></div>
);

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const { article, isLoading, error } = useArticleById(id || "");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);

    // Preload next article
    if (article?.id) {
      const nextArticleId = String(Number(article.id) + 1);
      const preloadArticle = new Image();
      preloadArticle.src = `https://havaasa-backend-production.up.railway.app/api/articles/${nextArticleId}`;
    }
  }, [article]);

  // Function to prepare OG data
  const getOgData = (article: any) => {
    const baseUrl = window.location.origin;
    const currentUrl = `${baseUrl}/article/${id}`;
    const defaultImageUrl = `${baseUrl}/og-image.png`;

    const imageUrl = article.image_url || defaultImageUrl;

    return {
      title: article.title,
      description:
        article.excerpt || article.content?.substring(0, 160) + "...",
      image: imageUrl,
      url: currentUrl,
      type: "article",
      site_name: "Gaafu Magazine",
      locale: "dv_MV",
      author: article.author || article.author_name,
      publishedTime: article.created_at,
      section: article.category ? categoryLabels[article.category] : undefined,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Helmet>
          <title>Loading... | Gaafu Magazine</title>
          <meta name="description" content="Loading article..." />
        </Helmet>
        <Suspense fallback={<LoadingFallback />}>
          <Header />
        </Suspense>
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="w-full h-64 bg-gaafu-muted animate-pulse rounded-xl mb-6"></div>
            <div className="w-3/4 h-10 bg-gaafu-muted animate-pulse rounded-lg mb-4"></div>
            <div className="w-full h-4 bg-gaafu-muted animate-pulse rounded mb-3"></div>
            <div className="w-full h-4 bg-gaafu-muted animate-pulse rounded mb-3"></div>
            <div className="w-2/3 h-4 bg-gaafu-muted animate-pulse rounded mb-6"></div>
          </div>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <Footer />
        </Suspense>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen">
        <Helmet>
          <title>Article Not Found | Gaafu Magazine</title>
          <meta
            name="description"
            content="The requested article could not be found."
          />
        </Helmet>
        <Suspense fallback={<LoadingFallback />}>
          <Header />
        </Suspense>
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4 font-dhivehi">
            އާޓިކަލް ނުފެނުނު
          </h1>
          <p className="mb-6">އާޓިކަލް ލިބެން ނެތް ނުވަތަ ކުށެއް ދިމާވެއްޖެ</p>
          <Link
            to="/"
            className="text-gaafu-accent hover:text-gaafu-highlight py-2 px-6 rounded-full bg-gaafu-accent-light/50 hover:bg-gaafu-accent-light inline-block transition-colors"
          >
            މައި ސަފްޙާއަށް ދާންވީތަ؟
          </Link>
        </div>
        <Suspense fallback={<LoadingFallback />}>
          <Footer />
        </Suspense>
      </div>
    );
  }

  const og = getOgData(article);

  return (
    <div
      className={`min-h-screen transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Helmet>
        {/* Basic meta tags */}
        <title>{og.title} | Gaafu Magazine</title>
        <meta name="description" content={og.description} />
        <link rel="canonical" href={og.url} />

        {/* OpenGraph meta tags */}
        <meta property="og:url" content={og.url} />
        <meta property="og:type" content={og.type} />
        <meta property="og:title" content={`${og.title} | Gaafu Magazine`} />
        <meta property="og:description" content={og.description} />
        <meta property="og:image" content={og.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content={og.site_name} />
        <meta property="og:locale" content={og.locale} />

        {/* Article specific */}
        {og.author && <meta property="article:author" content={og.author} />}
        {og.publishedTime && (
          <meta property="article:published_time" content={og.publishedTime} />
        )}
        {og.section && <meta property="article:section" content={og.section} />}

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${og.title} | Gaafu Magazine`} />
        <meta name="twitter:description" content={og.description} />
        <meta name="twitter:image" content={og.image} />
      </Helmet>

      <Suspense fallback={<LoadingFallback />}>
        <Header />
      </Suspense>

      <main className="pt-32 pb-16">
        <article className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Category Label */}
            {article.category && (
              <div className="mb-5">
                <Link
                  to={`/category/${article.category}`}
                  className={`inline-block ${
                    categoryColors[article.category]
                  } py-1.5 px-4 rounded-full text-sm font-medium shadow-sm font-dhivehi`}
                >
                  {categoryLabels[article.category]}
                </Link>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight font-dhivehi">
              {article.title}
            </h1>

            {/* Article Meta */}
            <div className="flex items-center justify-between text-gaafu-foreground/60 mb-8 text-sm font-dhivehi">
              {(article.author || article.author_name) && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="font-dhivehi">
                    {article.author || article.author_name}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="font-dhivehi">
                  {formatDate(article.created_at)}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-8 rounded-xl overflow-hidden shadow-md">
              <OptimizedImage
                src={article.image_url}
                alt={article.title}
                className="w-full"
              />
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none font-dhivehi">
              {/* Excerpt as intro paragraph */}
              {article.excerpt && (
                <p className="font-medium text-xl font-dhivehi">
                  {article.excerpt}
                </p>
              )}

              {/* Main content */}
              <div className="mt-6 font-dhivehi">{article.content}</div>
            </div>

            {/* Share */}
            <div className="mt-12 pt-6 border-t border-gaafu-border">
              <div className="flex items-center justify-between">
                <h3 className="font-medium font-dhivehi">
                  މިމާވާދު ޝެއަރ ކުރާ:
                </h3>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    className="p-3 rounded-full bg-gaafu-muted hover:bg-gaafu-accent hover:text-white transition-colors shadow-sm font-dhivehi"
                    aria-label="Share"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Suspense fallback={<LoadingFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Article;
