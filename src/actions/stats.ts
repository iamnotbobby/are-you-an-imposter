"use server";

import { redis } from "@/lib/redis";

export async function getConfessionStats(): Promise<{
	total: number;
	deleted: number;
}> {
	try {
		const [allConfessions, nextIdStr] = await Promise.all([
			redis.zrange("confessions", 0, -1),
			redis.get("confession:next_id"),
		]);

		const activeCount = allConfessions.length;
		const nextId =
			typeof nextIdStr === "string"
				? parseInt(nextIdStr)
				: typeof nextIdStr === "number"
					? nextIdStr
					: 0;

		if (nextId === 0) {
			return {
				total: activeCount,
				deleted: 0,
			};
		}

		const totalEverCreated = nextId;
		const deletedCount = totalEverCreated - activeCount;

		return {
			total: activeCount,
			deleted: Math.max(0, deletedCount),
		};
	} catch (error) {
		console.error("Error fetching stats:", error);
		return {
			total: 0,
			deleted: 0,
		};
	}
}
