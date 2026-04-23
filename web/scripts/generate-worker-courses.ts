import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface CourseEntry {
  slug: string;
  nome: string;
  ano: number;
  total: number;
}

const coursesPath = resolve(__dirname, "../src/data/courses.json");
const courses: CourseEntry[] = JSON.parse(readFileSync(coursesPath, "utf-8"));

const map: Record<string, { nome: string; ano: number; total: number }> = {};
for (const c of courses) {
  map[c.slug] = { nome: c.nome, ano: c.ano, total: c.total };
}

const outPath = resolve(__dirname, "../../worker/src/courses.ts");
writeFileSync(
  outPath,
  `// Auto-generated from courses.json -- do not edit manually\nexport const COURSES: Record<string, { nome: string; ano: number; total: number }> = ${JSON.stringify(map, null, 2)};\n`,
  "utf-8"
);

console.log(`worker/src/courses.ts generated: ${courses.length} entries`);
