"use client";

import { motion } from "motion/react";
import { ModeratorPanel } from "./moderator-panel";
import { formatTimestamp } from "@/lib/utils";

interface ConfessionCardProps {
	id: number;
	text: string;
	color: string;
	date: string;
	createdAt: number;
	index: number;
	onClick?: () => void;
	onDelete?: () => void;
	showModeratorTools?: boolean;
	isSelected?: boolean;
	onToggleSelect?: () => void;
}

export function ConfessionCard({
	id,
	text,
	color,
	date,
	createdAt,
	index,
	onClick,
	onDelete,
	showModeratorTools = false,
	isSelected = false,
	onToggleSelect,
}: ConfessionCardProps) {
	const rotations = [-2, 1, -1, 2, -1.5, 0.5, 1.5, -0.5];
	const rotation = rotations[index % rotations.length];

	return (
		<motion.div
			id={`confession-${id}`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.5,
				delay: index * 0.08,
				ease: [0.4, 0.0, 0.2, 1],
			}}
			whileHover={{
				scale: 1.05,
				rotate: 0,
				zIndex: 10,
				transition: { duration: 0.2 },
			}}
			onClick={onClick}
			className="cursor-pointer relative group"
			style={{ rotate: `${rotation}deg` }}
		>
			{showModeratorTools && onDelete && (
				<div onClick={(e) => e.stopPropagation()}>
					<ModeratorPanel
						confession={{ id, text, color, date }}
						onDelete={onDelete}
						isSelected={isSelected}
						onToggleSelect={onToggleSelect}
					/>
				</div>
			)}

			<div
				className="relative border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
				style={{ backgroundColor: color }}
			>
				<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/60 border border-black/20 rotate-0 shadow-sm" />

				<div className="p-8 min-h-[280px] flex flex-col justify-between">
					<p
						className="text-lg md:text-xl text-black font-medium leading-relaxed break-words hyphens-auto"
						style={{ fontFamily: "Georgia, serif" }}
					>
						"{text}"
					</p>

					<div className="mt-6 pt-4 border-t-2 border-black/20 flex items-center justify-between">
						<span className="text-xs text-black/70 font-mono tracking-wider">
							{formatTimestamp(createdAt)}
						</span>
						<span className="text-xs text-black/70 font-bold">
							#{id.toString().padStart(4, "0")}
						</span>
					</div>
				</div>

				<div className="absolute bottom-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px] border-b-black/30" />
			</div>
		</motion.div>
	);
}
