import { NextResponse } from "next/server";
import { incrementPageViews, getPageViews } from "@/lib/cache";
import { getIP, hashIP } from "@/lib/rate-limit";

export async function POST(request: Request) {
	try {
		const ip = getIP(request);
		const hashedIP = hashIP(ip);

		await incrementPageViews(hashedIP);
		const views = await getPageViews();

		return NextResponse.json({ views });
	} catch (error) {
		console.error("Error tracking view:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		const views = await getPageViews();

		return NextResponse.json({ views });
	} catch (error) {
		console.error("Error getting views:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
