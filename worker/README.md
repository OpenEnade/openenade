# Worker: Bot Meta Injection

Cloudflare Worker que intercepta requests de bots sociais e retorna HTML com meta tags corretas para previews (Twitter Cards, OpenGraph).

## Por que

O OpenEnade e uma SPA (React 19). Bots de redes sociais (Twitter, Facebook, LinkedIn, WhatsApp, Slack, Discord, Telegram) nao executam JavaScript -- eles leem apenas o HTML inicial. Sem o Worker, todos os links compartilhados mostram o mesmo preview generico.

O Worker resolve isso sem SSR: quando detecta um bot, retorna HTML minimo com `og:title`, `og:description` e `og:image` corretos para aquela rota. Humanos recebem a SPA normalmente.

## Por que nao SSR

O free tier do Cloudflare Workers tem limite de **10ms de CPU por request**. React `renderToString` pode exceder isso em componentes nao-triviais. Bot meta injection custa <1ms (string interpolation).

## Arquitetura

```
Request -> Worker
             |
             +-- Bot? -> Rota conhecida? -> HTML com og: tags (string interpolation)
             |                  |
             |                  +-- Nao -> env.ASSETS.fetch() (SPA)
             |
             +-- Humano -> env.ASSETS.fetch() (SPA)
```

## Arquivos

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/index.ts` | Entry point: detecao de bot + roteamento |
| `src/bot-html.ts` | Template HTML para respostas de bot + helpers de metadata |
| `src/courses.ts` | Metadados dos cursos (auto-gerado, nao editar) |

## Bots detectados

```
Twitterbot, facebookexternalhit, LinkedInBot, WhatsApp,
Slackbot, Discordbot, TelegramBot
```

Pattern: case-insensitive regex no header `User-Agent`.

## Rotas com meta injection

| Rota | og:title | og:image |
|------|----------|----------|
| `/` | OpenEnade | `/og/default.png` |
| `/sobre` | Sobre \| OpenEnade | `/og/default.png` |
| `/metodologia` | Metodologia \| OpenEnade | `/og/default.png` |
| `/ranking/{slug}` | {CURSO} {ANO} \| OpenEnade | `/og/{slug}.png` |

Qualquer outra rota (incluindo `/comparar`) cai no fallback: `env.ASSETS.fetch()`.

## Configuracao (`wrangler.jsonc`)

```jsonc
{
    "name": "openenade",
    "compatibility_date": "2025-12-22",
    "main": "worker/src/index.ts",
    "assets": {
        "directory": "./web/dist",
        "binding": "ASSETS",
        "not_found_handling": "single-page-application",
        "run_worker_first": true
    }
}
```

Campos criticos:

- **`run_worker_first: true`** -- sem isso, requests para `/` servem `index.html` direto do edge cache, bypassando o Worker. Bots nunca veriam as meta tags.
- **`binding: "ASSETS"`** -- disponibiliza `env.ASSETS.fetch()` para o Worker delegar requests de humanos para os assets estaticos.

## `courses.ts` (auto-gerado)

Este arquivo e gerado pelo script `web/scripts/generate-worker-courses.ts` durante `npm run build`. Contem o mapa `slug -> { nome, ano, total }` de todos os cursos.

**Nao editar manualmente.** Para atualizar, rode o build:

```bash
cd web && npm run build
```

## Testar localmente

```bash
cd web && npm run build
cd ..
npx wrangler dev --port 8799

# Humano (SPA)
curl http://localhost:8799/

# Bot (HTML com og: tags)
curl -H "User-Agent: Twitterbot/1.0" http://localhost:8799/ranking/medicina-2023

# Bot em pagina estatica
curl -H "User-Agent: facebookexternalhit/1.1" http://localhost:8799/sobre
```

## Deploy

```bash
cd web && npm run build
cd ..
npx wrangler deploy
```

## Limites do free tier

| Limite | Valor | Impacto |
|--------|-------|---------|
| Requests/dia | 100.000 | Suficiente para projeto pessoal |
| CPU/request | 10ms | Bot injection usa <1ms |
| Bundle (gzip) | 3 MB | Worker + courses.ts e pequeno |
| Memoria | 128 MB | Sem problema para string interpolation |

Se o limite diario for atingido, o Worker falha aberto (bypass): bots recebem a SPA sem meta tags. Degradacao graceful.
