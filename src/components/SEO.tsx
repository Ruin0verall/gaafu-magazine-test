import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  section?: string;
}

const SITE_NAME = "ހަވާސާ މީޑިއާ";

const SEO = ({
  title,
  description,
  image = "/og-image.png",
  url = "https://havaasa.com",
  type = "article",
  publishedTime,
  author,
  section,
}: SEOProps) => {
  const fullTitle = `${title} - ${SITE_NAME}`;
  const baseUrl = url.endsWith("/") ? url.slice(0, -1) : url;
  const imageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={`${title} - ${SITE_NAME}`} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={`${title} - ${SITE_NAME}`} />
      <meta name="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />

      {/* Article Specific Meta Tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && section && (
        <meta property="article:section" content={section} />
      )}

      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
