import { createHash } from "crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export function hashIP(ip: string): string {
	return createHash("sha256").update(ip).digest("hex");
}

// CF IP
export function getIP(request: Request): string {
	const cfIP = request.headers.get("cf-connecting-ip");

	if (cfIP) {
		return cfIP;
	}

	const forwardedFor = request.headers.get("x-forwarded-for");

	if (forwardedFor) {
		return forwardedFor.split(",")[0].trim();
	}

	return "unknown";
}

// 10 requests per 1 minute
export const ratelimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(10, "1 m"),
	analytics: false,
	prefix: "@upstash/ratelimit",
});
