# AI Portfolio Editor

Describe the portfolio you want in plain English, and get back a real, live preview you can keep talking to until it's right. Built as a standalone project — you can clone it and run it without hooking up any external backend.

**Status: planning / early scaffolding.** The architecture is figured out, I just haven't started building it yet. See [Status](#status) below for where things actually stand.

## What it does

- You give it a short prompt, something like "a minimal photography portfolio, dark theme, three projects," and it turns that into a structured JSON site spec through a schema-constrained LLM call.
- That JSON gets rendered into an actual live preview, not a mockup or a written description of what it'd look like.
- You can keep refining it conversationally — "make the hero bigger," "swap in a lighter color" — and each of those becomes a small, targeted edit to the existing spec rather than starting over from scratch.
- No external services required. Everything runs locally out of the box.

## The prompt engineering part

Honestly, the UI is the easy part. What I actually spent time thinking about is that the two places this project talks to an LLM need to be prompted in pretty different ways:

- **`generate.ts`** does the open-ended work — take a loose prompt and produce a full site spec in one go. It's schema-constrained through tool use, so the model isn't just typing out JSON and hoping it's valid; it's filling in a typed shape (`Block`, `PageLayout`, `Portfolio`) that gets checked against a Zod schema right after. A few-shot prompt helps keep the tone and layout choices from feeling random from one generation to the next.
- **`refine.ts`** is the harder one. It gets the existing spec plus something short like "make the hero bigger," and has to figure out which piece of an already-built site that's even talking about, then change just that piece without touching anything else. Edit, don't regenerate, is really the whole idea the project is built around.

Put those two side by side and it's basically a little case study in prompting the same model for two very different jobs — one wide open, one narrow and careful — against one shared schema.

### Keeping things from all looking the same

Schema-constrained generation has an obvious trap: everything comes back looking identical, because the model tends to just lean on whatever few-shot examples it was shown, and the schema itself might not leave much room to be different anyway. A couple of things here are meant to head that off:

- The schema doesn't box design choices into a tiny enum like `"dark" | "light"` or `"grid" | "list"`. Color, type, spacing, and layout per section are all left open enough that two valid specs can genuinely look nothing alike.
- Before generation even runs, a small step — `lib/ai/tokens.ts` — picks a palette, a font pairing, and a layout direction, and hands that to the model as a constraint. So variety isn't something you're hoping the model chooses on its own; it's baked in before it even starts.

`generate.ts` also runs hotter (higher temperature) than `refine.ts`, since one of them is supposed to be creative and the other is supposed to be careful.

## Why it's built this way

Nothing in the AI logic or the UI talks directly to a database or an API — everything goes through one interface, `PortfolioStore`. This repo only ships one implementation of it, `LocalStore`, which is what lets the whole thing run standalone with nothing external required.

I kept that interface generic on purpose, not tied to any of `LocalStore`'s internal details, so a different persistence backend could implement it down the line without touching the AI logic or the UI at all. There's no such adapter here yet — this project is meant to stand on its own for now — but the door's left open for later.

## Architecture

```
User prompt
    │
    ▼
lib/ai/tokens.ts     ── picks a palette / font pairing / layout direction before generating
    │
    ▼
lib/ai/generate.ts   ── schema-constrained LLM call (tool use / structured output, few-shot)
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
app/                  ── preview UI, renders the spec into live components
    │
    ▼
lib/ai/refine.ts       ── existing spec + instruction → a targeted diff, not a full redo
```

## Tech stack

- Next.js / React (frontend + API routes)
- TypeScript throughout, schema checked with Zod
- LLM: schema-constrained tool use (model still TBD)
- Local persistence: in-memory / lightweight local store, no external DB needed

## Project structure

```
ai-portfolio-editor/
├── lib/
│   ├── ai/
│   │   ├── tokens.ts         # picks palette/font/layout direction before generating
│   │   ├── generate.ts       # prompt -> JSON site spec
│   │   └── refine.ts         # existing spec + instruction -> targeted diff
│   ├── store/
│   │   ├── PortfolioStore.ts # interface — the only contract the app depends on
│   │   └── LocalStore.ts     # standalone implementation used here
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

*(This is the intended workflow — `package.json` and scripts aren't actually in place yet, see Status below.)*

## Status

- [x] Repo scaffolding (`package.json`, Next.js init)
- [x] Schema + types defined (`lib/schema.ts`)
- [ ] `LocalStore` implementation
- [ ] Design token pre-step (`lib/ai/tokens.ts`)
- [ ] Generate flow (`lib/ai/generate.ts`) with schema validation
- [ ] Preview renderer (spec → live components)
- [ ] Refine flow (`lib/ai/refine.ts`)
- [ ] Polish: loading states, error handling, demo templates for the README GIF

## License

MIT