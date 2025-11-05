import { redis } from "@/lib/redis";
import { createHash, randomBytes } from "crypto";

export async function incrementPageViews(hashedIP: string): Promise<boolean> {
	try {
		const visitorKey = `visitor:${hashedIP}`;
		const exists = await redis.exists(visitorKey);

		if (exists === 0) {
			const timestamp = new Date().toISOString();
			await redis.hset("site:visitors", { [hashedIP]: timestamp });
			return true;
		}

		return false;
	} catch (error) {
		console.error("Error incrementing views:", error);
		return false;
	}
}

export async function getPageViews(): Promise<number> {
	try {
		const visitors = await redis.hgetall("site:visitors");
		return visitors ? Object.keys(visitors).length : 0;
	} catch (error) {
		console.error("Error getting views:", error);
		return 0;
	}
}

export function generateDeleteToken(
	confessionId: number,
	text: string,
	timestamp: number,
): string {
	const secret = randomBytes(32).toString("hex");
	const hash = createHash("sha256")
		.update(`${confessionId}:${text}:${timestamp}:${secret}`)
		.digest("hex");

	return hash;
}

export async function storeDeleteToken(
	confessionId: number,
	token: string,
): Promise<void> {
	try {
		await redis.hset("confession:tokens", { [confessionId.toString()]: token });
	} catch (error) {
		console.error("Error storing delete token:", error);
	}
}

export async function verifyDeleteToken(
	confessionId: number,
	token: string,
): Promise<boolean> {
	try {
		const storedToken = await redis.hget(
			"confession:tokens",
			confessionId.toString(),
		);
		return storedToken === token;
	} catch (error) {
		console.error("Error verifying delete token:", error);
		return false;
	}
}

export async function removeDeleteToken(confessionId: number): Promise<void> {
	try {
		await redis.hdel("confession:tokens", confessionId.toString());
	} catch (error) {
		console.error("Error removing delete token:", error);
	}
}
