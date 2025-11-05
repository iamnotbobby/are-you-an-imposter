import { NextResponse } from "next/server";
import { redis, type Confession } from "@/lib/redis";
import { ratelimit, getIP, hashIP } from "@/lib/rate-limit";
import { verifyCaptcha } from "@/lib/captcha";
import { generateDeleteToken, storeDeleteToken } from "@/lib/cache";

const AVAILABLE_COLORS = [
	"#8B9DC3",
	"#A8D5BA",
	"#DDA15E",
	"#BC6C25",
	"#6B9080",
	"#C77DFF",
	"#7B9E89",
	"#C9ADA7",
	"#B8A4C9",
	"#F4A5A5",
	"#CE6A85",
	"#80B192",
];

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const cursor = searchParams.get("cursor") || "+inf";
		const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);

		const maxScore =
			cursor === "+inf" ? "+inf" : (parseFloat(cursor) as number);
		const results = await redis.zrange("confessions", maxScore, "-inf", {
			byScore: true,
			rev: true,
			offset: 0,
			count: limit + 1,
		});

		const confessions: Confession[] = results
			.slice(0, limit)
			.map((item: any) => (typeof item === "string" ? JSON.parse(item) : item));

		const hasMore = results.length > limit;
		const nextCursor =
			hasMore && confessions.length > 0
				? confessions[confessions.length - 1].createdAt - 1
				: null;

		return NextResponse.json({
			confessions,
			nextCursor,
			hasMore,
		});
	} catch (error) {
		console.error("Error fetching confessions:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const settings = await redis.get<{
			submissionsPaused?: boolean;
			requireApproval?: boolean;
		}>("site:settings");

		if (settings?.submissionsPaused) {
			return NextResponse.json(
				{ error: "Submissions are currently paused. Please try again later." },
				{ status: 503 },
			);
		}

		const ip = getIP(request);
		const hashedIP = hashIP(ip);
		const { success, remaining } = await ratelimit.limit(hashedIP);

		if (!success) {
			return NextResponse.json(
				{ error: "Too many requests. Please try again later." },
				{
					status: 429,
					headers: { "X-RateLimit-Remaining": remaining.toString() },
				},
			);
		}

		const body = await request.json();
		const { text, color, captchaToken } = body;

		if (!captchaToken || typeof captchaToken !== "string") {
			return NextResponse.json(
				{ error: "CAPTCHA verification required" },
				{ status: 400 },
			);
		}

		const isCaptchaValid = await verifyCaptcha(captchaToken);
		if (!isCaptchaValid) {
			return NextResponse.json(
				{ error: "CAPTCHA verification failed. Please try again." },
				{ status: 400 },
			);
		}

		if (!text || typeof text !== "string") {
			return NextResponse.json({ error: "Text is required" }, { status: 400 });
		}

		if (text.length > 500) {
			return NextResponse.json(
				{ error: "Text must be 500 characters or less" },
				{ status: 400 },
			);
		}

		if (!color || !AVAILABLE_COLORS.includes(color)) {
			return NextResponse.json({ error: "Invalid color" }, { status: 400 });
		}

		const id = await redis.incr("confession:next_id");

		const confession: Confession = {
			id,
			text: text.trim(),
			color,
			date: new Date()
				.toLocaleDateString("en-US", {
					month: "long",
					day: "numeric",
					year: "numeric",
				})
				.toLowerCase(),
			createdAt: Date.now(),
		};

		const targetSet = settings?.requireApproval
			? "confessions:pending"
			: "confessions";

		await redis.zadd(targetSet, {
			score: confession.createdAt,
			member: JSON.stringify(confession),
		});

		const deleteToken = generateDeleteToken(
			id,
			confession.text,
			confession.createdAt,
		);
		await storeDeleteToken(id, deleteToken);

		return NextResponse.json(
			{
				success: true,
				confession,
				deleteToken,
				pending: settings?.requireApproval || false,
			},
			{
				status: 201,
				headers: { "X-RateLimit-Remaining": remaining.toString() },
			},
		);
	} catch (error) {
		console.error("Error creating confession:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
