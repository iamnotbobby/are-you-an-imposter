import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getModeratorStatus } from "@/lib/moderation";

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const isModerator = await getModeratorStatus();

		if (!isModerator) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const confessionId = parseInt(id);

		if (isNaN(confessionId)) {
			return NextResponse.json(
				{ error: "Invalid confession ID" },
				{ status: 400 },
			);
		}

		const body = await request.json();
		const { text } = body;

		if (!text || typeof text !== "string" || text.length > 500) {
			return NextResponse.json({ error: "Invalid text" }, { status: 400 });
		}

		const allConfessions = await redis.zrange("confessions", 0, -1);

		let updated = false;
		for (const item of allConfessions) {
			const confessionStr =
				typeof item === "string" ? item : JSON.stringify(item);
			const confession = typeof item === "string" ? JSON.parse(item) : item;

			if (confession.id === confessionId) {
				await redis.zrem("confessions", confessionStr);

				confession.text = text.trim();

				await redis.zadd("confessions", {
					score: confession.createdAt,
					member: JSON.stringify(confession),
				});

				updated = true;
				return NextResponse.json({ success: true, confession });
			}
		}

		if (!updated) {
			return NextResponse.json(
				{ error: "Confession not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error editing confession:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
