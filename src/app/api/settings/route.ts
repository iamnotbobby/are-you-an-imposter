import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getModeratorStatus } from "@/lib/moderation";

interface Settings {
	submissionsPaused: boolean;
	requireApproval: boolean;
}

export async function GET() {
	try {
		const settings = await redis.get<Settings>("site:settings");

		return NextResponse.json({
			submissionsPaused: settings?.submissionsPaused || false,
			requireApproval: settings?.requireApproval || false,
		});
	} catch (error) {
		console.error("Error fetching settings:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const isModerator = await getModeratorStatus();

		if (!isModerator) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { submissionsPaused, requireApproval } = body;

		const settings: Settings = {
			submissionsPaused: submissionsPaused || false,
			requireApproval: requireApproval || false,
		};

		await redis.set("site:settings", settings);

		return NextResponse.json({ success: true, settings });
	} catch (error) {
		console.error("Error updating settings:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
