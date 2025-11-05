"use server";

import { redis } from "@/lib/redis";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const MODERATOR_EMAIL = process.env.MODERATOR_EMAIL || "";

interface Settings {
	submissionsPaused: boolean;
	requireApproval: boolean;
}

interface Confession {
	id: number;
	text: string;
	color: string;
	date: string;
	createdAt: number;
}

export async function getModeratorStatus(): Promise<boolean> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		return session?.user?.email === MODERATOR_EMAIL;
	} catch {
		return false;
	}
}

export async function getSettings() {
	const settings = await redis.get<Settings>("site:settings");
	return {
		submissionsPaused: settings?.submissionsPaused || false,
		requireApproval: settings?.requireApproval || false,
	};
}

export async function updateSettings(
	submissionsPaused: boolean,
	requireApproval: boolean,
) {
	const isModerator = await getModeratorStatus();

	if (!isModerator) {
		throw new Error("Unauthorized");
	}

	const settings: Settings = { submissionsPaused, requireApproval };
	await redis.set("site:settings", settings);

	return { success: true, settings };
}

export async function getPendingConfessions() {
	const isModerator = await getModeratorStatus();

	if (!isModerator) {
		throw new Error("Unauthorized");
	}

	const pending = await redis.zrange("confessions:pending", 0, -1, {
		rev: true,
	});

	const confessions: Confession[] = pending.map((item: any) =>
		typeof item === "string" ? JSON.parse(item) : item,
	);

	return confessions;
}

export async function processPendingConfession(
	id: number,
	action: "approve" | "reject",
) {
	const isModerator = await getModeratorStatus();

	if (!isModerator) {
		throw new Error("Unauthorized");
	}

	const pending = await redis.zrange("confessions:pending", 0, -1);

	for (const item of pending) {
		const confessionStr =
			typeof item === "string" ? item : JSON.stringify(item);
		const confession = typeof item === "string" ? JSON.parse(item) : item;

		if (confession.id === id) {
			await redis.zrem("confessions:pending", confessionStr);

			if (action === "approve") {
				await redis.zadd("confessions", {
					score: confession.createdAt,
					member: JSON.stringify(confession),
				});
			}

			return { success: true };
		}
	}

	throw new Error("Confession not found");
}

export async function batchDeleteConfessions(ids: number[]) {
	const isModerator = await getModeratorStatus();

	if (!isModerator) {
		throw new Error("Unauthorized");
	}

	if (!Array.isArray(ids) || ids.length === 0) {
		throw new Error("Invalid IDs array");
	}

	const allConfessions = await redis.zrange("confessions", 0, -1);
	let deletedCount = 0;

	for (const item of allConfessions) {
		const confessionStr =
			typeof item === "string" ? item : JSON.stringify(item);
		const confession = typeof item === "string" ? JSON.parse(item) : item;

		if (ids.includes(confession.id)) {
			await redis.zrem("confessions", confessionStr);
			deletedCount++;
		}
	}

	return { success: true, deletedCount };
}

export async function editConfession(id: number, text: string) {
	const isModerator = await getModeratorStatus();

	if (!isModerator) {
		throw new Error("Unauthorized");
	}

	if (!text || typeof text !== "string" || text.length > 500) {
		throw new Error("Invalid text");
	}

	const allConfessions = await redis.zrange("confessions", 0, -1);

	for (const item of allConfessions) {
		const confessionStr =
			typeof item === "string" ? item : JSON.stringify(item);
		const confession = typeof item === "string" ? JSON.parse(item) : item;

		if (confession.id === id) {
			await redis.zrem("confessions", confessionStr);

			confession.text = text.trim();

			await redis.zadd("confessions", {
				score: confession.createdAt,
				member: JSON.stringify(confession),
			});

			return { success: true, confession };
		}
	}

	throw new Error("Confession not found");
}
