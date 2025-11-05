import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		// BetterAuth
		BETTER_AUTH_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(1),
		// Database
		DATABASE_URL: z.string().min(1),
		// Github
		GITHUB_CLIENT_ID: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1),
		// Captcha
		CAPTCHA_SECRET_KEY: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_CAPTCHA_SITE_KEY: z.string().min(1),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_CAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
	},
});
