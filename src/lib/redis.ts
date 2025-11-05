import { Redis } from "@upstash/redis";

if (
	!process.env.UPSTASH_REDIS_REST_URL ||
	!process.env.UPSTASH_REDIS_REST_TOKEN
) {
	throw new Error("Missing Upstash Redis credentials");
}

export const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL,
	token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export interface Confession {
	id: number;
	text: string;
	color: string;
	date: string;
	createdAt: number;
}
