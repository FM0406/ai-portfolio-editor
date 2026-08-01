import { Portfolio, PageLayout, ThemeTokens } from "../schema";
import { PortfolioStore } from "./PortfolioStore";

// Default theme tokens for new portfolios
const defaultTheme: ThemeTokens = {
    background: "#111111",
    text: "#f5f5f5",
    accent: "#ff5733",
    fontHeading: "Playfair Display",
    fontBody: "Inter",
    spacingScale: 1.1,
};

// LocalStore implements the PortfolioStore interface
// It stores portfolios and pages in memory using Map objects
// All methods are synchronous and return void or undefined
export class LocalStore implements PortfolioStore {
    private portfolios: Map<string, Portfolio>; // keyed by portfolio id
    private pages: Map<string, PageLayout[]>; // keyed by portfolio id, holds that portfolio's pages

    constructor() {
        this.portfolios = new Map();
        this.pages = new Map();
    }

    // Create a new portfolio with a default theme and no pages
    createPortfolio(name: string): Portfolio {
        const portfolio: Portfolio = {
            id: crypto.randomUUID(),
            name,
            theme: defaultTheme,
            pages: [],
        };
        this.portfolios.set(portfolio.id, portfolio);
        return portfolio;
    }

    // Get a portfolio by id
    getPortfolio(id: string): Portfolio | undefined {
        return this.portfolios.get(id);
    }

    // Get all pages for a portfolio
    getPages(portfolioId: string): PageLayout[] {
        return this.pages.get(portfolioId) || [];
    }

    // Save a page for a portfolio
    savePage(portfolioId: string, page: PageLayout): void {
        const pages = this.pages.get(portfolioId) || [];
        const index = pages.findIndex(p=>p.id === page.id); // Find the index of the page with the same id
        // If the page already exists, update it
        if (index !== -1) {
            pages[index] = page;
        // Otherwise, add it 
        } else {
            pages.push(page);
        }
        this.pages.set(portfolioId, pages); // Save the updated pages back to the map
    }
}

