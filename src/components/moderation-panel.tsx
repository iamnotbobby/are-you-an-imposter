"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
	X,
	Settings,
	CheckCircle,
	XCircle,
	Trash2,
	Power,
	Lock,
	LogOut,
} from "lucide-react";
import {
	getPendingConfessions,
	processPendingConfession,
	batchDeleteConfessions,
} from "@/lib/moderation";
import { getSettings, updateSettings } from "@/actions/settings";
import { signOut } from "@/lib/auth-client";

interface Confession {
	id: number;
	text: string;
	color: string;
	date: string;
	createdAt: number;
}

interface ModPanelProps {
	isOpen: boolean;
	onClose: () => void;
	onRefresh: () => void;
	selectedIds: number[];
	setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
	allConfessions: Confession[];
}

export function ModerationPanel({
	isOpen,
	onClose,
	onRefresh,
	selectedIds,
	setSelectedIds,
	allConfessions,
}: ModPanelProps) {
	const [activeTab, setActiveTab] = useState<"settings" | "pending">(
		"settings",
	);
	const [submissionsPaused, setSubmissionsPaused] = useState(false);
	const [requireApproval, setRequireApproval] = useState(false);
	const [pending, setPending] = useState<Confession[]>([]);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		if (isOpen) {
			loadSettings();
			if (activeTab === "pending") {
				loadPending();
			}
		}
	}, [isOpen, activeTab]);

	const loadSettings = async () => {
		const data = await getSettings();
		setSubmissionsPaused(data.submissionsPaused);
		setRequireApproval(data.requireApproval);
	};

	const loadPending = async () => {
		try {
			const data = await getPendingConfessions();
			setPending(data);
		} catch (error) {
			console.error("Error loading pending:", error);
		}
	};

	const handleSettingsUpdate = (
		key: "submissionsPaused" | "requireApproval",
		value: boolean,
	) => {
		startTransition(async () => {
			try {
				const newSubmissionsPaused =
					key === "submissionsPaused" ? value : submissionsPaused;
				const newRequireApproval =
					key === "requireApproval" ? value : requireApproval;

				const result = await updateSettings({
					submissionsPaused: newSubmissionsPaused,
					requireApproval: newRequireApproval,
				});

				if (result.success) {
					if (key === "submissionsPaused") setSubmissionsPaused(value);
					if (key === "requireApproval") setRequireApproval(value);
				} else {
					console.error("Error updating settings:", result.error);
				}
			} catch (error) {
				console.error("Error updating settings:", error);
			}
		});
	};

	const handlePendingAction = (id: number, action: "approve" | "reject") => {
		startTransition(async () => {
			try {
				await processPendingConfession(id, action);
				setPending((prev) => prev.filter((c) => c.id !== id));
				if (action === "approve") {
					onRefresh();
				}
			} catch (error) {
				console.error("Error processing pending:", error);
			}
		});
	};

	const handleBatchDelete = () => {
		if (selectedIds.length === 0) return;

		startTransition(async () => {
			try {
				await batchDeleteConfessions(selectedIds);
				setSelectedIds([]);
				onRefresh();
			} catch (error) {
				console.error("Error batch deleting:", error);
			}
		});
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
						onClick={onClose}
					/>

					<motion.div
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ type: "spring", damping: 30, stiffness: 300 }}
						className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white border-l-4 border-black shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] z-50 overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="sticky top-0 bg-white border-b-3 border-black p-6 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Settings className="w-6 h-6" />
								<h2
									className="text-2xl font-bold"
									style={{ fontFamily: "Georgia, serif" }}
								>
									moderation panel
								</h2>
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() => {
										signOut();
										onClose();
									}}
									className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 border-2 border-black transition-colors font-medium text-sm cursor-pointer"
									aria-label="Sign out"
								>
									<LogOut className="w-4 h-4" />
									sign out
								</button>
								<button
									onClick={onClose}
									className="p-2 hover:bg-gray-100 border-2 border-black transition-colors cursor-pointer"
									aria-label="Close"
								>
									<X className="w-6 h-6" />
								</button>
							</div>
						</div>

						<div className="border-b-3 border-black flex">
							<button
								onClick={() => setActiveTab("settings")}
								className={`flex-1 py-4 px-6 font-bold transition-colors border-r-2 border-black cursor-pointer ${
									activeTab === "settings"
										? "bg-black text-white"
										: "bg-white text-black hover:bg-gray-100"
								}`}
							>
								settings
							</button>
							<button
								onClick={() => setActiveTab("pending")}
								className={`flex-1 py-4 px-6 font-bold transition-colors cursor-pointer ${
									activeTab === "pending"
										? "bg-black text-white"
										: "bg-white text-black hover:bg-gray-100"
								}`}
							>
								pending {pending.length > 0 && `(${pending.length})`}
							</button>
						</div>

						<div className="p-6">
							{activeTab === "settings" && (
								<div className="space-y-6">
									<div className="border-3 border-black p-6 bg-gray-50">
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<Power className="w-5 h-5" />
													<h3 className="font-bold text-lg">
														pause submissions
													</h3>
												</div>
												<p className="text-sm text-gray-600">
													temporarily stop accepting new confessions
												</p>
											</div>
											<button
												onClick={() =>
													handleSettingsUpdate(
														"submissionsPaused",
														!submissionsPaused,
													)
												}
												disabled={isPending}
												className={`px-6 py-3 font-bold border-3 border-black transition-all cursor-pointer disabled:opacity-70 ${
													submissionsPaused
														? "bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
														: "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
												}`}
											>
												{submissionsPaused ? "PAUSED" : "ACTIVE"}
											</button>
										</div>
									</div>

									<div className="border-3 border-black p-6 bg-gray-50">
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<Lock className="w-5 h-5" />
													<h3 className="font-bold text-lg">
														require approval
													</h3>
												</div>
												<p className="text-sm text-gray-600">
													all new confessions will need manual approval before
													being published
												</p>
											</div>
											<button
												onClick={() =>
													handleSettingsUpdate(
														"requireApproval",
														!requireApproval,
													)
												}
												disabled={isPending}
												className={`px-6 py-3 font-bold border-3 border-black transition-all cursor-pointer disabled:opacity-70 ${
													requireApproval
														? "bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
														: "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
												}`}
											>
												{requireApproval ? "ON" : "OFF"}
											</button>
										</div>
									</div>

									<div className="border-3 border-black p-6 bg-gray-50">
										<h3 className="font-bold text-lg mb-4">batch delete</h3>
										<p className="text-sm text-gray-600 mb-4">
											click the checkbox on cards to select multiple for
											deletion
										</p>

										{selectedIds.length > 0 && (
											<div className="mb-4 border-2 border-red-300 bg-red-50 p-4 max-h-60 overflow-y-auto">
												<div className="flex justify-between items-center mb-2">
													<h4 className="font-bold text-sm text-red-800">
														selected ({selectedIds.length})
													</h4>
													<button
														onClick={() => setSelectedIds([])}
														className="text-xs px-2 py-1 bg-white border-2 border-black hover:bg-gray-100 cursor-pointer"
													>
														deselect all
													</button>
												</div>
												<div className="space-y-2">
													{selectedIds.map((id) => {
														const confession = allConfessions.find(
															(c) => c.id === id,
														);
														if (!confession) return null;
														return (
															<div
																key={id}
																className="bg-white border-2 border-black p-3 text-sm flex items-start justify-between gap-2"
															>
																<div className="flex-1 min-w-0">
																	<div className="font-bold text-xs mb-1">
																		#{id.toString().padStart(4, "0")}
																	</div>
																	<div className="text-xs text-gray-700 truncate">
																		"{confession.text}"
																	</div>
																</div>
																<button
																	onClick={() =>
																		setSelectedIds((prev) =>
																			prev.filter((i) => i !== id),
																		)
																	}
																	className="flex-shrink-0 text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 border border-black cursor-pointer"
																>
																	<X className="w-3 h-3" />
																</button>
															</div>
														);
													})}
												</div>
											</div>
										)}

										<button
											onClick={handleBatchDelete}
											disabled={selectedIds.length === 0 || isPending}
											className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-bold border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
										>
											<Trash2 className="w-4 h-4" />
											delete selected ({selectedIds.length})
										</button>
									</div>
								</div>
							)}

							{activeTab === "pending" && (
								<div className="space-y-4">
									{pending.length === 0 ? (
										<div className="text-center py-12 border-3 border-dashed border-gray-300">
											<p className="text-gray-500">no pending confessions</p>
										</div>
									) : (
										pending.map((confession) => (
											<div
												key={confession.id}
												className="border-3 border-black p-4"
												style={{ backgroundColor: confession.color }}
											>
												<p
													className="text-lg mb-4"
													style={{ fontFamily: "Georgia, serif" }}
												>
													"{confession.text}"
												</p>
												<div className="flex items-center justify-between pt-4 border-t-2 border-black/20">
													<span className="text-sm text-black/70">
														#{confession.id.toString().padStart(4, "0")}
													</span>
													<div className="flex gap-2">
														<button
															onClick={() =>
																handlePendingAction(confession.id, "approve")
															}
															disabled={isPending}
															className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer disabled:opacity-70"
														>
															<CheckCircle className="w-4 h-4" />
															Approve
														</button>
														<button
															onClick={() =>
																handlePendingAction(confession.id, "reject")
															}
															disabled={isPending}
															className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer disabled:opacity-70"
														>
															<XCircle className="w-4 h-4" />
															Reject
														</button>
													</div>
												</div>
											</div>
										))
									)}
								</div>
							)}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
