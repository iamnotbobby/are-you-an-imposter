"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface DeleteManagerModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

export function DeleteManagerModal({
	isOpen,
	onClose,
	onSuccess,
}: DeleteManagerModalProps) {
	const [deleteTokenInput, setDeleteTokenInput] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState("");
	const [savedConfessions, setSavedConfessions] = useState<
		{ id: number; token: string }[]
	>([]);

	const loadSavedConfessions = () => {
		const saved: { id: number; token: string }[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith("confession_")) {
				const id = parseInt(key.replace("confession_", ""));
				const token = localStorage.getItem(key);
				if (token) {
					saved.push({ id, token });
				}
			}
		}
		setSavedConfessions(saved);
	};

	const handleDeleteConfession = async (id: number, token: string) => {
		setIsDeleting(true);
		setError("");

		try {
			const response = await fetch("/api/confessions/delete", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, token }),
			});

			if (response.ok) {
				localStorage.removeItem(`confession_${id}`);
				loadSavedConfessions();
				onSuccess?.();
			} else {
				const data = await response.json();
				setError(data.error || "invalid token");
			}
		} catch (err) {
			setError("failed to delete confession");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleDeleteWithToken = async () => {
		if (!deleteTokenInput.trim()) return;

		const matches = deleteTokenInput.match(/^(\d+):(.+)$/);
		if (matches) {
			const id = parseInt(matches[1]);
			const token = matches[2];
			await handleDeleteConfession(id, token);
			setDeleteTokenInput("");
		} else {
			setError("invalid token format. should be id:token");
		}
	};

	useEffect(() => {
		if (isOpen) {
			loadSavedConfessions();
		} else {
			setDeleteTokenInput("");
			setError("");
		}
	}, [isOpen]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
						onClick={onClose}
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}
							className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[80vh] overflow-y-auto"
						>
							<div className="p-6 space-y-6">
								<div className="flex justify-between items-center">
									<h2 className="text-2xl font-black">
										manage deletions
									</h2>
									<button
										onClick={onClose}
										className="p-2 hover:bg-gray-100 transition-colors"
									>
										<svg
											className="w-6 h-6"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>

								{savedConfessions.length > 0 ? (
									<div className="space-y-4">
										<p className="text-sm font-bold text-gray-600">
											your saved confessions:
										</p>
										{savedConfessions.map(({ id, token }) => (
											<div
												key={id}
												className="border-3 border-black p-4 bg-gray-50 space-y-3"
											>
												<div className="flex justify-between items-start">
													<div className="flex-1">
														<p className="text-sm font-bold text-gray-600">
															confession #{id}
														</p>
														<p className="font-mono text-xs text-gray-500 break-all mt-1">
															{token}
														</p>
													</div>
													<button
														onClick={() => handleDeleteConfession(id, token)}
														disabled={isDeleting}
														className="ml-4 px-4 py-2 bg-red-500 text-white font-bold border-2 border-black hover:bg-red-600 disabled:opacity-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
													>
														{isDeleting ? "..." : "delete"}
													</button>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="border-3 border-gray-300 p-8 text-center">
										<p className="text-gray-500">no saved confessions found</p>
									</div>
								)}

								<div className="border-t-3 border-black pt-6 space-y-4">
									<p className="text-sm font-bold text-gray-600">
										or enter a deletion token manually:
									</p>
									<div className="flex gap-2 flex-col sm:flex-row">
										<input
											type="text"
											value={deleteTokenInput}
											onChange={(e) => setDeleteTokenInput(e.target.value)}
											placeholder="paste token here"
											className="flex-1 px-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
										/>
										<button
											onClick={handleDeleteWithToken}
											disabled={isDeleting || !deleteTokenInput.trim()}
											className="px-6 py-2 bg-red-500 text-white font-bold border-2 border-black hover:bg-red-600 disabled:opacity-50 transition-colors"
										>
											{isDeleting ? "deleting..." : "delete"}
										</button>
									</div>
								</div>

								{error && (
									<div className="p-3 bg-red-100 border-2 border-red-500 rounded text-sm text-red-700">
										{error}
									</div>
								)}

								<button
									onClick={onClose}
									className="w-full px-6 py-3 bg-black text-white font-bold border-3 border-black hover:bg-gray-800 transition-colors"
								>
									close
								</button>
							</div>
						</motion.div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
