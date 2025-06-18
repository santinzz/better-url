import './envConfig.ts';
import { z } from 'zod/v4';

const envSchema = z.object({
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
})

export const env = envSchema.parse(process.env);