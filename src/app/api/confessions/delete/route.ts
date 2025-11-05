import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { verifyDeleteToken, removeDeleteToken } from "@/lib/cache";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { id, token } = body;

		if (!id || !token) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const isValid = await verifyDeleteToken(id, token);

		if (!isValid) {
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

			if (confession.id === id) {
				await redis.zrem("confessions", confessionStr);
				await removeDeleteToken(id);

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
