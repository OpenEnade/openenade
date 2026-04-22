import { Helmet } from "react-helmet-async";

interface SeoHeadProps {
  title?: string;
  description?: string;
}

const DEFAULT_TITLE = "OpenEnade";
const DEFAULT_DESC = "Ranking real das universidades brasileiras com base na nota contínua do ENADE";

export function SeoHead({ title, description }: SeoHeadProps) {
  const fullTitle = title ? `${title} | OpenEnade` : DEFAULT_TITLE;
  const desc = description ?? DEFAULT_DESC;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
