import { env } from "@/env";

export async function verifyCaptcha(token: string): Promise<boolean> {
	try {
		const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;
		const secretKey = env.CAPTCHA_SECRET_KEY;

		if (!siteKey || !secretKey) {
			console.error("CAPTCHA configuration missing");
			return false;
		}

		const verifyUrl = `https://captcha.areyouanimposter.com/${siteKey}/siteverify`;

		const response = await fetch(verifyUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				secret: secretKey,
				response: token,
			}),
		});

		if (!response.ok) {
			console.error("CAPTCHA verification failed:", response.statusText);
			return false;
		}

		const data = await response.json();
		return data.success === true;
	} catch (error) {
		console.error("Error verifying CAPTCHA:", error);
		return false;
	}
}
