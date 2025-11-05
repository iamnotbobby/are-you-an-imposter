"use client";

import { useEffect, useState } from "react";

function getOrdinalSuffix(n: number): string {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function ViewCounter() {
	const [views, setViews] = useState<number | null>(null);

	useEffect(() => {
		fetch("/api/views", { method: "POST" })
			.then((res) => res.json())
			.then((data) => setViews(data.views))
			.catch((err) => console.error("Error updating views:", err));
	}, []);

	if (views === null) {
		return <span>loading...</span>;
	}

	return <span>{getOrdinalSuffix(views)} visitor</span>;
}
