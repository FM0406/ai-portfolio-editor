import { ThemeTokensSchema } from "../schema";
import { z } from "zod";

const themeToolSchema = z.toJSONSchema(ThemeTokensSchema);
