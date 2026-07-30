import { z } from "zod"; //Vallidates and parses data

// Theme tokens are intentionally unconstrained on color/font values 
// to keep generated portfolios visually distinct from each other.
export const ThemeTokensSchema = z.object({
    background: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Must be a hex colour"),
    text: z.string().regex(/^#([0-9a-fA-F]{6})$/),
    accent: z.string().regex(/^#([0-9a-fA-F]{6})$/),
    fontHeading: z.string().min(1, "Must be a font name"),
    fontBody: z.string().min(1, "Must be a font name"),
    spacingScale: z.number().min(0.75).max(1.5),
});

export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;


//Every block will share an id, which will be needed for React keys later
//and for refine.ts to target a specific block.
const BlockBaseSchema = z.object({
    id: z.string(),
});

// The main block on a page — usually first, sets the tone for the whole site.
const HeroBlockSchema = BlockBaseSchema.extend({
    type: z.literal("hero"),
    heading: z.string().min(1),
    subheading: z.string().optional(),
});

// A set of images, e.g. a photography portfolio's core content.
// Bounded to 1-4 columns since an unbounded column count could break layout.
const GalleryBlockSchema = BlockBaseSchema.extend({
    type: z.literal("gallery"),
    images: z.array(z.object({
        src: z.string().url(),
        caption: z.string().optional(),
    })).min(1),
    columns: z.number().min(1).max(4).optional(),
});

// General prose — bio, artist statement, "about me" content.
// Color/font are NOT overridable here on purpose: they come from
// ThemeTokensSchema so the whole portfolio stays visually consistent.
const TextBlockSchema = BlockBaseSchema.extend({
    type: z.literal("text"),
    content: z.string().min(1),
    emphasis: z.enum(["normal", "subtle", "strong"]).optional(),
});

// A single case study / portfolio piece with its own title and description.
const ProjectBlockSchema = BlockBaseSchema.extend({
    type: z.literal("project"),
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.string().url(),
    link: z.string().url().optional(),
});

// Contact/social links, usually placed near the footer.
const LinksBlockSchema = BlockBaseSchema.extend({
    type: z.literal("links"),
    links: z.array(z.object({
        label: z.string().min(1),
        url: z.string().url(),
    })).min(1),
});

// A pull-quote or testimonial, often used for client feedback or a personal motto.
const QuoteBlockSchema = BlockBaseSchema.extend({
    type: z.literal("quote"),
    quote: z.string().min(1),
    author: z.string().min(1).optional(),
});

// Empty vertical space between blocks, in pixels — lets the LLM control
// breathing room without faking it with an empty text block.
const SpacerBlockSchema = BlockBaseSchema.extend({
    type: z.literal("spacer"),
    height: z.number().min(1).max(100).optional(),
});

export const BlockSchema = z.discriminatedUnion("type", [
    HeroBlockSchema,
    GalleryBlockSchema,
    TextBlockSchema,
    ProjectBlockSchema,
    LinksBlockSchema,
    QuoteBlockSchema,
    SpacerBlockSchema,
  ]);
  
export type Block = z.infer<typeof BlockSchema>;

// A single page within a portfolio, which contains an ordered list of blocks.
export const PageLayoutSchema = z.object({
    id: z.string(),
    slug: z.string().min(1), //The URL slug for the page
    title: z.string().min(1), //The title of the page
    blocks: z.array(BlockSchema),
});

export type PageLayout = z.infer<typeof PageLayoutSchema>;

// The full site - a name, one shared theme, and one or more pages.
export const PortfolioSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    theme: ThemeTokensSchema,
    pages: z.array(PageLayoutSchema),
});

export type Portfolio = z.infer<typeof PortfolioSchema>;
