import { Helmet } from "react-helmet-async";

interface SeoHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE = "https://openenade.emanueljoivo.com";
const DEFAULT_TITLE = "OpenEnade";
const DEFAULT_DESC =
  "Ranking real das universidades brasileiras com base na nota contínua do ENADE";
const DEFAULT_OG_IMAGE = `${SITE}/og/default.png`;

export function SeoHead({ title, description, ogImage, jsonLd }: SeoHeadProps) {
  const fullTitle = title ? `${title} | OpenEnade` : DEFAULT_TITLE;
  const desc = description ?? DEFAULT_DESC;
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />

      {/* OpenGraph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="OpenEnade" />
      <meta property="og:image" content={image} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
