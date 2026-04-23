const SITE = "https://openenade.emanueljoivo.com";

interface MetaParams {
  title: string;
  description: string;
  url: string;
  image: string;
}

export function botHtml({ title, description, url, image }: MetaParams): string {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="OpenEnade" />
  <meta property="og:image" content="${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
</head>
<body>
  <p>${description}</p>
  <p><a href="${url}">Ver ranking completo no OpenEnade</a></p>
</body>
</html>`;
}

export function rankingMeta(
  slug: string,
  nome: string,
  ano: number,
  total: number
): MetaParams {
  return {
    title: `${nome} ${ano} | OpenEnade`,
    description: `Ranking de ${nome} no ENADE ${ano}: ${total} IES avaliadas com nota continua`,
    url: `${SITE}/ranking/${slug}`,
    image: `${SITE}/og/${slug}.png`,
  };
}

export function defaultMeta(path: string): MetaParams {
  const pages: Record<string, { title: string; description: string }> = {
    "/": {
      title: "OpenEnade",
      description:
        "Ranking real das universidades brasileiras com base na nota continua do ENADE",
    },
    "/sobre": {
      title: "Sobre | OpenEnade",
      description:
        "O que e o OpenEnade, sua historia e o time por tras do projeto",
    },
    "/metodologia": {
      title: "Metodologia | OpenEnade",
      description:
        "Como o OpenEnade processa os dados do ENADE: pipeline ETL e fontes de dados",
    },
  };

  const page = pages[path] ?? pages["/"]!;
  return {
    title: page.title,
    description: page.description,
    url: `${SITE}${path}`,
    image: `${SITE}/og/default.png`,
  };
}
