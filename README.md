# AI Portfolio Editor

An AI-assisted portfolio site builder: describe what you want in plain language, get a live, editable preview back, and refine it conversationally. Built as a standalone project — no external backend required to run it.

**Status: planning / early scaffolding.** Architecture is decided; implementation hasn't started yet. See [Status](#status) below.

## What it does

- Takes a short prompt ("a minimal photography portfolio, dark theme, three projects") and generates a structured JSON site spec via a schema-constrained LLM call.
- Renders that JSON into a live, real preview — not a static description.
- Supports conversational refinement ("make the hero bigger," "swap in a lighter color") as targeted edits to the existing spec, not full regenerations.
- Runs entirely standalone, with its own lightweight local data layer.

## Why it's built this way

The persistence layer sits behind a single interface (`PortfolioStore`), so the AI logic and UI never talk to a database or API directly — only to that interface. This repo ships one implementation of it (`LocalStore`), which is what makes the project fully runnable on its own with zero external dependencies.

The interface is intentionally designed so a different backend could implement it later without touching the AI logic or UI — but that adapter doesn't exist in this repo. This project stands on its own.

## Architecture

```
User prompt
    │
    ▼
lib/ai/generate.ts   ── schema-constrained LLM call (tool use / structured output)
    │
    ▼
lib/schema.ts         ── validated JSON site spec (Block, PageLayout, Portfolio types)
    │
    ▼
lib/store/PortfolioStore.ts  ── interface: getPortfolio, getPages, savePage, createPortfolio
    │
    ▼
lib/store/LocalStore.ts      ── the only implementation in this repo
    │
    ▼
app/                  ── preview UI, renders spec into live components
    │
    ▼
lib/ai/refine.ts       ── existing spec + instruction → updated spec (targeted diff)
```

## Tech stack

- Next.js / React (frontend + API routes)
- TypeScript throughout, schema validated with Zod
- LLM: schema-constrained tool use (model TBD)
- Local persistence: in-memory / lightweight local store (no external DB required)

## Project structure

```
ai-portfolio-editor/
├── lib/
│   ├── ai/
│   │   ├── generate.ts       # prompt -> JSON site spec
│   │   └── refine.ts         # existing spec + instruction -> updated spec
│   ├── store/
│   │   ├── PortfolioStore.ts # interface — the only contract the app depends on
│   │   └── LocalStore.ts     # standalone implementation used by this repo
│   └── schema.ts             # Block, PageLayout, Portfolio types + Zod schema
├── app/                       # UI: prompt input, live preview, refine controls
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## Getting started

```bash
git clone <repo-url>
cd ai-portfolio-editor
npm install
cp .env.example .env.local   # add your LLM API key
npm run dev
```

*(Setup steps above reflect the intended workflow — `package.json` and scripts aren't in place yet; see Status.)*

## Status

- [1] Repo scaffolding (`package.json`, Next.js init)
- [ ] Schema + types defined (`lib/schema.ts`)
- [ ] `LocalStore` implementation
- [ ] Generate flow (`lib/ai/generate.ts`) with schema validation
- [ ] Preview renderer (spec → live components)
- [ ] Refine flow (`lib/ai/refine.ts`)
- [ ] Polish: loading states, error handling, demo templates for the README GIF

## License

MIT
