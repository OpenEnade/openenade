import { COURSES } from "./courses";
import { botHtml, rankingMeta, defaultMeta } from "./bot-html";

const BOT_PATTERN =
  /Twitterbot|facebookexternalhit|LinkedInBot|WhatsApp|Slackbot|Discordbot|TelegramBot/i;

export default {
  async fetch(
    request: Request,
    env: { ASSETS: { fetch: (req: Request) => Promise<Response> } }
  ): Promise<Response> {
    const ua = request.headers.get("user-agent") ?? "";

    if (!BOT_PATTERN.test(ua)) {
      return env.ASSETS.fetch(request);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Match /ranking/{slug}
    const rankingMatch = path.match(/^\/ranking\/([a-z0-9-]+)$/);
    if (rankingMatch) {
      const slug = rankingMatch[1];
      const course = COURSES[slug];
      if (course) {
        const meta = rankingMeta(slug, course.nome, course.ano, course.total);
        return new Response(botHtml(meta), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
    }

    // Static pages
    if (path === "/" || path === "/sobre" || path === "/metodologia") {
      const meta = defaultMeta(path);
      return new Response(botHtml(meta), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    // Everything else: pass through to static assets
    return env.ASSETS.fetch(request);
  },
};
