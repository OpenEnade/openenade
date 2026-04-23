import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface CourseEntry {
  slug: string;
  nome: string;
  ano: number;
  total: number;
}

const coursesPath = resolve(__dirname, "../src/data/courses.json");
const courses: CourseEntry[] = JSON.parse(readFileSync(coursesPath, "utf-8"));

const fontPath = resolve(__dirname, "fonts/JetBrainsMono-Bold.ttf");
const fontData = readFileSync(fontPath);

const outDir = resolve(__dirname, "../dist/og");
mkdirSync(outDir, { recursive: true });

function ogCard(courseName: string, year: number, total: number) {
  return {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 80px",
        backgroundColor: "#0a0a0a",
        color: "#e0e0e0",
        fontFamily: "JetBrains Mono",
      },
      children: [
        // Top: branding
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center" },
            children: {
              type: "span",
              props: {
                style: { color: "#00ff9d", fontSize: "28px", fontWeight: 700 },
                children: "> OpenEnade",
              },
            },
          },
        },
        // Center: course info
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: "16px" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "52px",
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.1,
                  },
                  children: courseName,
                },
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: "24px" },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: { fontSize: "32px", color: "#00ff9d", fontWeight: 700 },
                        children: `ENADE ${year}`,
                      },
                    },
                    ...(total > 0
                      ? [
                          {
                            type: "span",
                            props: {
                              style: { fontSize: "24px", color: "#888888" },
                              children: `${total} IES avaliadas`,
                            },
                          },
                        ]
                      : []),
                  ],
                },
              },
            ],
          },
        },
        // Bottom: tagline
        {
          type: "div",
          props: {
            style: { fontSize: "18px", color: "#555555" },
            children: "Ranking real com nota continua - sem arredondamento",
          },
        },
      ],
    },
  };
}

async function generateImage(
  courseName: string,
  year: number,
  total: number,
  filename: string
) {
  const svg = await satori(ogCard(courseName, year, total) as React.ReactNode, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "JetBrains Mono",
        data: fontData,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const png = resvg.render().asPng();
  writeFileSync(resolve(outDir, filename), png);
}

async function main() {
  const total = courses.length + 1;
  console.log(`Generating ${total} og:image PNGs...`);

  // Default card (no total count)
  await generateImage("OpenEnade", 2023, 0, "default.png");

  // Per-course cards
  for (const course of courses) {
    await generateImage(course.nome, course.ano, course.total, `${course.slug}.png`);
  }

  console.log(`og:image done: ${total} PNGs in dist/og/`);
}

main().catch((err) => {
  console.error("og:image generation failed:", err);
  process.exit(1);
});
