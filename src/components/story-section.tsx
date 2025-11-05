"use client";

import { motion } from "motion/react";
import { FAQSection } from "./faq-section";

interface StorySectionProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	resultsCount: number;
}

export function StorySection({
	searchQuery,
	onSearchChange,
	resultsCount,
}: StorySectionProps) {
	const startDelay = 2.5;

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
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: startDelay + 0.6, duration: 0.6 }}
				className="my-10 flex items-center justify-center"
			>
				<div className="h-px bg-gray-300 w-24"></div>
				<div className="mx-4 text-gray-400">•</div>
				<div className="h-px bg-gray-300 w-24"></div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: startDelay + 0.8, duration: 0.8 }}
				className="mb-10"
			>
				<FAQSection />
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: startDelay + 1, duration: 0.6 }}
				className="my-10 flex items-center justify-center"
			>
				<div className="h-px bg-gray-300 w-24"></div>
				<div className="mx-4 text-gray-400">•</div>
				<div className="h-px bg-gray-300 w-24"></div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: startDelay + 1.2, duration: 0.8 }}
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
				{searchQuery && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="mt-2 text-sm text-gray-600"
					>
						found {resultsCount} confession{resultsCount !== 1 ? "s" : ""}
					</motion.p>
				)}
				{!searchQuery && (
					<p className="mt-2 text-xs text-gray-500 text-center">
						tip: search by text or ID (e.g., #5)
					</p>
				)}
			</motion.div>
		</motion.section>
	);
}
