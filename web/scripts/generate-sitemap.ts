import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = "https://openenade.emanueljoivo.com";

interface CourseEntry {
  slug: string;
  nome: string;
  ano: number;
  total: number;
}

const coursesPath = resolve(__dirname, "../src/data/courses.json");
const courses: CourseEntry[] = JSON.parse(readFileSync(coursesPath, "utf-8"));

const staticRoutes = ["/", "/sobre", "/metodologia"];

const urls = [
  ...staticRoutes.map(
    (r) =>
      `  <url><loc>${SITE}${r}</loc><priority>${r === "/" ? "1.0" : "0.5"}</priority></url>`
  ),
  ...courses.map(
    (c) =>
      `  <url><loc>${SITE}/ranking/${c.slug}</loc><priority>0.8</priority></url>`
  ),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

const outPath = resolve(__dirname, "../dist/sitemap.xml");
writeFileSync(outPath, sitemap, "utf-8");
console.log(`sitemap.xml generated: ${urls.length} URLs`);
