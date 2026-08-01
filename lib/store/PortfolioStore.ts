import {Portfolio, PageLayout} from "../schema";

// The PortfolioStore interface defines the methods that must be implemented by any store that wants to be used with the portfolio app.
export interface PortfolioStore {
    createPortfolio(name: string): Portfolio;
    getPortfolio(id: string): Portfolio | undefined;
    getPages(portfolioId: string): PageLayout[];
    savePage(portfolioId: string, page: PageLayout): void; 
}  