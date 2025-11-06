"use client";

import { motion } from "motion/react";
import { FAQSection } from "./faq-section";
import { useEffect, useState } from "react";
import { getConfessionStats } from "@/actions/stats";

interface StorySectionProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	resultsCount: number;
	onStatsRefresh?: number;
}

export function StorySection({
	searchQuery,
	onSearchChange,
	resultsCount,
	onStatsRefresh,
}: StorySectionProps) {
	const startDelay = 2.0;
	const [stats, setStats] = useState<{ total: number; deleted: number } | null>(
		null,
	);

	useEffect(() => {
		getConfessionStats()
			.then((data) => setStats(data))
			.catch(() => {});
	}, [onStatsRefresh]);

	return (
		<motion.section className="max-w-4xl mx-auto px-4 pt-4 pb-8 text-center">
			<div className="mb-10 max-w-2xl mx-auto">
				<div className="relative inline-block mb-6">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: startDelay, duration: 0.8 }}
						className="text-2xl md:text-3xl font-bold text-black"
					>
						you belong here.
					</motion.h2>

					<motion.svg
						className="absolute -bottom-1 left-0 w-full h-3 overflow-visible"
						viewBox="0 0 300 12"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<motion.path
							d="M2 7 C 15 4, 25 9, 40 6 S 60 4, 75 7 C 90 9, 105 5, 120 6 S 140 8, 155 6 C 170 5, 185 8, 200 7 S 220 5, 235 7 C 250 8, 265 5, 280 6 S 290 7, 298 6"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-black"
							initial={{ pathLength: 0, opacity: 0 }}
							animate={{ pathLength: 1, opacity: 1 }}
							transition={{
								pathLength: {
									delay: startDelay + 0.5,
									duration: 1.4,
									ease: [0.4, 0.0, 0.2, 1],
								},
								opacity: { delay: startDelay + 0.5, duration: 0.01 },
							}}
						/>
					</motion.svg>
				</div>

				<div className="space-y-5 text-base text-gray-700 leading-relaxed">
					<motion.p
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: startDelay + 0.8, duration: 0.6 }}
						className="font-medium"
					>
						anonymous confessions about imposter syndrome. you're not alone in
						feeling this way.
					</motion.p>

					<motion.p
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: startDelay + 1.1, duration: 0.6 }}
					>
						this is a space for{" "}
						<span className="relative inline-block font-bold">
							<span className="relative z-10">authentic feelings</span>
							<motion.span
								className="absolute inset-0 bg-yellow-300/60 -mx-1 -my-0.5"
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								transition={{
									delay: startDelay + 1.5,
									duration: 0.6,
									ease: [0.4, 0.0, 0.2, 1],
								}}
								style={{ transformOrigin: "left" }}
							/>
						</span>
						. no toxic positivity. no quick fixes. just real experiences from
						real people.
					</motion.p>

					<motion.p
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: startDelay + 1.4, duration: 0.6 }}
						className="text-sm text-gray-600 pt-2"
					>
						inspired by{" "}
						<a
							href="https://theunsentproject.com/"
							target="_blank"
							rel="noopener noreferrer"
							className="italic underline hover:text-black transition-colors"
						>
							The Unsent Project
						</a>
					</motion.p>
				</div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: startDelay + 1.8, duration: 0.6 }}
				className="my-10"
			>
				<FAQSection />
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: startDelay + 2.2, duration: 0.6 }}
				className="mb-10"
			>
				<div className="relative max-w-2xl mx-auto">
					<input
						type="text"
						placeholder="search confessions or enter #id..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full px-6 py-4 text-base border-4 border-black focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all"
					/>
					<svg
						className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
				{stats && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
						className="mt-4 flex items-center justify-center gap-4 sm:gap-6 text-sm font-mono flex-wrap"
					>
						<div className="flex items-center gap-2">
							<span className="text-gray-700">confessions:</span>
							<span className="font-bold text-black">{stats.total}</span>
						</div>
						<svg
							width="24"
							height="6"
							viewBox="0 0 24 6"
							className="text-gray-700"
							style={{ minWidth: "24px" }}
						>
							<path
								d="M1 3 C 2 2.5, 3 3.5, 4 2.8 C 5 2.3, 6 3.8, 7 3 C 8 2.4, 9 3.6, 10 2.9 C 11 2.5, 12 3.7, 13 3.2 C 14 2.6, 15 3.4, 16 3 C 17 2.7, 18 3.5, 19 2.8 C 20 2.4, 21 3.3, 22 3.1 C 22.5 2.9, 23 3.2, 23 3"
								stroke="currentColor"
								strokeWidth="1.5"
								fill="none"
								strokeLinecap="round"
							/>
						</svg>
						<div className="flex items-center gap-2">
							<span className="text-gray-700">deleted:</span>
							<span className="font-bold text-black">{stats.deleted}</span>
						</div>
					</motion.div>
				)}
				{searchQuery && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="mt-2 text-sm text-gray-600"
					>
						found {resultsCount} confession{resultsCount !== 1 ? "s" : ""}
					</motion.p>
				)}
			</motion.div>
		</motion.section>
	);
}
