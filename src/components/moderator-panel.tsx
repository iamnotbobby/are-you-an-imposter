"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface ModeratorPanelProps {
	confession: {
		id: number;
		text: string;
		color: string;
		date: string;
	};
	onDelete: () => void;
	isSelected?: boolean;
	onToggleSelect?: () => void;
}

export function ModeratorPanel({
	confession,
	onDelete,
	isSelected = false,
	onToggleSelect,
}: ModeratorPanelProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const response = await fetch(`/api/confessions/${confession.id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				onDelete();
			} else {
				const data = await response.json();
				alert(data.error || "Failed to delete confession");
			}
		} catch (error) {
			console.error("Error deleting confession:", error);
			alert("Failed to delete confession");
		} finally {
			setIsDeleting(false);
			setShowConfirm(false);
		}
	};

	return (
		<div className="absolute top-2 left-2 z-10 flex gap-2 items-start">
			{onToggleSelect && (
				<label className="flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white border-2 border-black rounded-lg shadow-md transition-colors cursor-pointer">
					<input
						type="checkbox"
						checked={isSelected}
						onChange={onToggleSelect}
						className="w-4 h-4 cursor-pointer accent-black"
						title="Select for batch operations"
						aria-label="Select confession"
					/>
				</label>
			)}

			{!showConfirm ? (
				<button
					onClick={() => setShowConfirm(true)}
					className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-colors cursor-pointer"
					title="Delete confession"
					aria-label="Delete confession"
				>
					<Trash2 className="w-4 h-4" />
				</button>
			) : (
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="bg-white border-2 border-red-500 rounded-lg p-2 shadow-lg"
				>
					<p className="text-xs font-bold mb-2 text-red-600">Delete this?</p>
					<div className="flex gap-1">
						<button
							onClick={handleDelete}
							disabled={isDeleting}
							className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded disabled:opacity-50 cursor-pointer"
						>
							{isDeleting ? "..." : "Yes"}
						</button>
						<button
							onClick={() => setShowConfirm(false)}
							className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-black text-xs rounded cursor-pointer"
						>
							No
						</button>
					</div>
				</motion.div>
			)}
		</div>
	);
}
