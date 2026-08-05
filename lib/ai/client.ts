import { z } from "zod"
import { anthropic } from "@ai-sdk/anthropic";
import { ollama } from "ai-sdk-ollama";
import {generateObject} from "ai";

// Get the model based on the provider and model name
function getModel(provider: string, modelName: string) {
    if (provider === "anthropic") {
        return anthropic(modelName);
    } else if (provider === "ollama") {
        return ollama(modelName);
    } else {
        throw new Error(`Unsupported model: ${provider}`);
    }
}

// Call the LLM with the given prompt and schema
export async function callLLM(prompt:string, schema: z.ZodType){
    const provider = process.env.LLM_PROVIDER ?? "ollama"; // Default to ollama if not set
    const modelName = process.env.LLM_MODEL ?? "qwen2.5"; // Default to qwen2.5 if not set
    const model = getModel(provider, modelName);
    const response = await generateObject({ 
        model,
        schema,
        prompt,
    });
    return response.object;
}