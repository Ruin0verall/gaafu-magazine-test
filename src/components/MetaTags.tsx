import React from "react";
import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  author?: string;
  publishedTime?: string;
  section?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  image,
  url,
  author,
  publishedTime,
  section,
}) => {
  const defaultTitle = "gaafu-magazine";
  const defaultDescription = "Lovable Generated Project";
  const defaultImage =
    "https://gaafu-magazine-test-eight.vercel.app/og-image.png";
  const defaultUrl = "https://gaafu-magazine-test-eight.vercel.app";

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalUrl = url || defaultUrl;

  // Ensure image URL is absolute
  const getAbsoluteUrl = (url: string | undefined): string => {
    if (!url) return defaultImage;

    try {
      // If it's already an absolute URL, return it
      if (url.startsWith("http")) return url;

      // If it's a relative URL starting with //, add https:
      if (url.startsWith("//")) return `https:${url}`;

      // If it's a relative URL, make it absolute
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : defaultUrl;
      // Remove any leading slash to avoid double slashes
      const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
      return `${baseUrl}/${cleanUrl}`;
    } catch (e) {
      console.warn("Invalid URL:", url);
      return defaultImage;
    }
  };

  const absoluteImageUrl = getAbsoluteUrl(image);

  return (
    <Helmet prioritizeSeoTags>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />

      {/* Facebook Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content="Gaafu Magazine" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:secure_url" content={absoluteImageUrl} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="dv_MV" />

      {/* Article specific OG tags */}
      {author && <meta property="article:author" content={author} />}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {section && <meta property="article:section" content={section} />}

      {/* Force meta tags to be in the head */}
      <meta name="fragment" content="!" />
      <link rel="canonical" href={finalUrl} />
    </Helmet>
  );
};

export default MetaTags;
