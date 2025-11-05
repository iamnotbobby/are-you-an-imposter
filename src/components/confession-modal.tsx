"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Share2, Trash2, Edit2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { formatTimestamp } from "@/lib/utils";

interface ConfessionModalProps {
	isOpen: boolean;
	onClose: () => void;
	confession: {
		id: number;
		text: string;
		color: string;
		date: string;
		createdAt: number;
	} | null;
	showModeratorTools?: boolean;
	onDelete?: () => void;
	onEdit?: (id: number, text: string) => void;
}

export function ConfessionModal({
	isOpen,
	onClose,
	confession,
	showModeratorTools = false,
	onDelete,
	onEdit,
}: ConfessionModalProps) {
	const [showCopied, setShowCopied] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		setIsEditing(false);
		setEditText("");
		setShowDeleteConfirm(false);
		setShowCopied(false);
	}, [confession?.id]);

	if (!confession) return null;

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const response = await fetch(`/api/confessions/${confession.id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				onClose();
				onDelete?.();
			} else {
				const data = await response.json();
				alert(data.error || "Failed to delete confession");
			}
		} catch (error) {
			console.error("Error deleting confession:", error);
			alert("Failed to delete confession");
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
		}
	};

	const handleEdit = async () => {
		if (!editText.trim() || editText.length > 500) return;

		setIsSaving(true);
		try {
			const response = await fetch(`/api/confessions/${confession.id}/edit`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: editText }),
			});

			if (response.ok) {
				onEdit?.(confession.id, editText);
				setIsEditing(false);
			} else {
				const data = await response.json();
				alert(data.error || "Failed to edit confession");
			}
		} catch (error) {
			console.error("Error editing confession:", error);
			alert("Failed to edit confession");
		} finally {
			setIsSaving(false);
		}
	};

	const startEdit = () => {
		setEditText(confession.text);
		setIsEditing(true);
	};

	const handleShare = async () => {
		const url = `${window.location.origin}?confession=${confession.id}`;
		const shareText = `"${confession.text}" - Anonymous confession #${confession.id.toString().padStart(4, "0")}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: "are you an imposter?",
					text: shareText,
					url: url,
				});
			} catch (err) {}
		} else {
			try {
				await navigator.clipboard.writeText(url);
				setShowCopied(true);
				setTimeout(() => setShowCopied(false), 2000);
			} catch (err) {
				console.error("Failed to copy:", err);
			}
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
						animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
						exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
						transition={{ duration: 0.3 }}
						className="fixed inset-0 bg-black/30 z-40"
						onClick={onClose}
					/>

					<div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none overflow-y-auto">
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 20 }}
							transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
							className="pointer-events-auto relative w-full max-w-3xl my-auto"
							onClick={(e) => e.stopPropagation()}
						>
							<div
								className="relative border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-12"
								style={{ backgroundColor: confession.color }}
							>
								<div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 w-16 h-6 sm:w-20 sm:h-8 bg-white/60 border border-black/20 shadow-sm z-10" />

								<button
									onClick={onClose}
									className="absolute top-3 right-3 sm:top-6 sm:right-6 p-1.5 sm:p-2 hover:bg-black/10 rounded-full transition-colors border-2 border-black bg-white"
									aria-label="close"
								>
									<X className="w-5 h-5 sm:w-6 sm:h-6" />
								</button>

								<div className="mb-6 sm:mb-8 mt-2 sm:mt-4">
									{isEditing ? (
										<div className="space-y-4">
											<textarea
												value={editText}
												onChange={(e) => setEditText(e.target.value)}
												maxLength={500}
												className="w-full min-h-[200px] p-4 border-3 border-black text-xl resize-none focus:outline-none focus:ring-2 focus:ring-black"
												style={{ fontFamily: "Georgia, serif" }}
												placeholder="Edit your confession..."
											/>
											<div className="flex items-center justify-between">
												<span className="text-sm text-black/70">
													{editText.length}/500 characters
												</span>
												<div className="flex gap-2">
													<button
														onClick={() => setIsEditing(false)}
														className="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black font-bold border-2 border-black transition-all"
													>
														cancel
													</button>
													<button
														onClick={handleEdit}
														disabled={
															isSaving ||
															!editText.trim() ||
															editText.length > 500
														}
														className="flex items-center gap-2 px-4 py-2 bg-black text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-50"
													>
														{isSaving ? "saving..." : "save"}
													</button>
												</div>
											</div>
										</div>
									) : (
										<p
											className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-black"
											style={{ fontFamily: "Georgia, serif" }}
										>
											"{confession.text}"
										</p>
									)}
								</div>

								{!isEditing && (
									<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-black/70 gap-3 pt-4 sm:pt-6 border-t-2 border-black/20">
										<div className="flex items-center gap-3 flex-wrap">
											<span className="font-mono tracking-wider text-xs">
												{formatTimestamp(confession.createdAt)}
											</span>
											<span className="font-bold">
												#{confession.id.toString().padStart(4, "0")}
											</span>
										</div>
										<div className="flex items-center gap-2 flex-wrap">
											{showModeratorTools && (
												<button
													onClick={startEdit}
													className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white border-3 border-black transition-colors font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
													aria-label="Edit confession"
												>
													<Edit2 className="w-4 h-4" />
													edit
												</button>
											)}
											{showModeratorTools && onDelete && (
												<div className="relative">
													{!showDeleteConfirm ? (
														<button
															onClick={() => setShowDeleteConfirm(true)}
															className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white border-3 border-black transition-colors font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
															aria-label="Delete confession"
														>
															<Trash2 className="w-4 h-4" />
															delete
														</button>
													) : (
														<motion.div
															initial={{ opacity: 0, scale: 0.8 }}
															animate={{ opacity: 1, scale: 1 }}
															className="flex items-center gap-2 bg-white border-3 border-black px-3 py-2"
														>
															<span className="text-xs font-bold text-red-600 whitespace-nowrap">
																Delete?
															</span>
															<button
																onClick={handleDelete}
																disabled={isDeleting}
																className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold border-2 border-black disabled:opacity-50 transition-colors"
															>
																{isDeleting ? "..." : "Yes"}
															</button>
															<button
																onClick={() => setShowDeleteConfirm(false)}
																className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-black text-xs font-bold border-2 border-black transition-colors"
															>
																No
															</button>
														</motion.div>
													)}
												</div>
											)}

											<div className="relative">
												<button
													onClick={handleShare}
													className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white border-2 border-black transition-all text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
													aria-label="share confession"
												>
													<Share2 className="w-4 h-4" />
													share
												</button>
												{showCopied && (
													<motion.div
														initial={{ opacity: 0, y: 10 }}
														animate={{ opacity: 1, y: 0 }}
														exit={{ opacity: 0 }}
														className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 text-xs whitespace-nowrap border-2 border-white"
													>
														link copied!
													</motion.div>
												)}
											</div>
										</div>
									</div>
								)}
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}
