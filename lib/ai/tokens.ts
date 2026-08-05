import { ThemeTokensSchema } from "../schema";
import {callLLM} from "./client";

export async function generateThemeTokens(userPrompt: string){
  const fullPrompt = `
  Generate a distinct visual theme (colors, font pairing, spacing) for a portfolio website.
  Portfolio description: ${userPrompt}
  
  spacingScale must be a number between 0.75 and 1.5, where 1.0 is standard spacing, below 1.0 is tighter/denser, and above 1.0 is more spacious.
  `;
    return callLLM(fullPrompt, ThemeTokensSchema);
}

