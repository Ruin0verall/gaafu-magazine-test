import React from "react";
import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  image,
  url,
}) => {
  const defaultTitle = "gaafu-magazine";
  const defaultDescription = "Lovable Generated Project";
  const defaultImage =
    "https://gaafu-magazine-test-eight.vercel.app/og-image.png";
  const defaultUrl = "https://gaafu-magazine-test-eight.vercel.app";

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;
  const finalUrl = url || defaultUrl;

  // Ensure image URL is absolute
  const getAbsoluteUrl = (url: string) => {
    try {
      if (url.startsWith("http")) return url;
      return new URL(url, window.location.origin).toString();
    } catch (e) {
      console.warn("Invalid URL:", url);
      return defaultImage;
    }
  };

  const absoluteImageUrl = getAbsoluteUrl(finalImage);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={absoluteImageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={absoluteImageUrl} />
    </Helmet>
  );
};

export default MetaTags;
