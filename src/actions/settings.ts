"use server";

import { redis } from "@/lib/redis";
import { getModeratorStatus } from "@/lib/moderation";

interface Settings {
	submissionsPaused: boolean;
	requireApproval: boolean;
}

export async function getSettings(): Promise<Settings> {
	try {
		const settings = await redis.get<Settings>("site:settings");

		return {
			submissionsPaused: settings?.submissionsPaused || false,
			requireApproval: settings?.requireApproval || false,
		};
	} catch (error) {
		console.error("Error fetching settings:", error);
		return {
			submissionsPaused: false,
			requireApproval: false,
		};
	}
}

export async function updateSettings(
	settings: Settings,
): Promise<{ success: boolean; error?: string }> {
	try {
		const isModerator = await getModeratorStatus();

		if (!isModerator) {
			return { success: false, error: "Unauthorized" };
		}

		await redis.set("site:settings", settings);

		return { success: true };
	} catch (error) {
		console.error("Error updating settings:", error);
		return { success: false, error: "Internal server error" };
	}
}
