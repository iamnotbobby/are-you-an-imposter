import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { removeDeleteToken } from "@/lib/cache";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { token } = body;

		if (!token) {
			return NextResponse.json({ error: "Missing token" }, { status: 400 });
		}

		const allTokens = await redis.hgetall("confession:tokens");

		if (!allTokens) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 403 },
			);
		}

		let confessionId: number | null = null;
		for (const [id, storedToken] of Object.entries(allTokens)) {
			if (storedToken === token) {
				confessionId = parseInt(id);
				break;
			}
		}

		if (confessionId === null) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 403 },
			);
		}

		const allConfessions = await redis.zrange("confessions", 0, -1);

		for (const item of allConfessions) {
			const confessionStr =
				typeof item === "string" ? item : JSON.stringify(item);
			const confession = typeof item === "string" ? JSON.parse(item) : item;

			if (confession.id === confessionId) {
				await redis.zrem("confessions", confessionStr);
				await removeDeleteToken(confessionId);

				return NextResponse.json({ success: true });
			}
		}

		return NextResponse.json(
			{ error: "Confession not found" },
			{ status: 404 },
		);
	} catch (error) {
		console.error("Error deleting confession:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
