import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useArticleById } from "@/hooks/useArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Calendar, User, Share2 } from "lucide-react";
import { categoryColors, categoryLabels } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getApiUrl } from "@/lib/config";
import AdSpace from "@/components/AdSpace";

const API_URL = getApiUrl();

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const { article, isLoading, error } = useArticleById(id || "");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <SEO title="Loading Article" description="Article is loading..." />
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="w-full h-64 bg-gaafu-muted animate-pulse rounded-xl mb-6"></div>
            <div className="w-3/4 h-10 bg-gaafu-muted animate-pulse rounded-lg mb-4"></div>
            <div className="w-full h-4 bg-gaafu-muted animate-pulse rounded mb-3"></div>
            <div className="w-full h-4 bg-gaafu-muted animate-pulse rounded mb-3"></div>
            <div className="w-2/3 h-4 bg-gaafu-muted animate-pulse rounded mb-6"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen">
        <SEO
          title="Article Not Found"
          description="The requested article could not be found."
        />
        <Header />
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
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `https://havaasa.com/article/${article.id}`;

  return (
    <div
      className={`min-h-screen transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <SEO
        title={article.title}
        description={article.excerpt || article.content.substring(0, 160)}
        image={article.image_url}
        url={canonicalUrl}
        type="article"
        publishedTime={article.created_at}
        author={article.author || article.author_name}
        section={categoryLabels[article.category || "habaru"]}
      />

      <Header />

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
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-auto"
              />
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none font-dhivehi">
              {/* Excerpt as intro paragraph */}
              {article.excerpt && (
                <p className="font-medium text-xl font-dhivehi text-right whitespace-normal break-words mb-6 leading-[1]">
                  {article.excerpt}
                </p>
              )}

              {/* Advertisement Square */}
              <div className="mb-8">
                <AdSpace variant="square" />
              </div>

              {/* Main content */}
              <div
                className="mt-6 font-dhivehi [&>*]:font-dhivehi [&_p]:text-right [&_p]:font-normal [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:mr-5 [&_ol]:mr-5 [&_li]:text-right [&_li]:mb-0 [&_p]:mb-0 [&_ul]:mb-1 [&_ol]:mb-1 [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_h4]:text-xl [&_h5]:text-lg [&_h6]:text-base [&_h1]:mb-2 [&_h2]:mb-2 [&_h3]:mb-1.5 [&_ul]:text-inherit [&_ol]:text-inherit [&_li]:text-inherit [&_*]:leading-[1.5] [&_p]:leading-[1.5] [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h4]:font-bold [&_h5]:font-bold [&_h6]:font-bold [&_p]:!font-size [&_p]:!font-size [&_span]:!font-size [&_strong]:!font-size [&_em]:!font-size [&_li]:!font-size"
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{ fontSize: "16px" }}
              />
            </div>

            {/* Banner Advertisement */}
            <div className="my-12">
              <AdSpace variant="banner" />
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

      <Footer />
    </div>
  );
};

export default Article;
