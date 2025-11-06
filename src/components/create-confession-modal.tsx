"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { CapWidget } from "@/components/captcha/cap-widget";

interface CreateConfessionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

const AVAILABLE_COLORS = [
	"#8B9DC3",
	"#A8D5BA",
	"#DDA15E",
	"#C9ADA7",
	"#B8A4C9",
	"#F4A5A5",
];

export function CreateConfessionModal({
	isOpen,
	onClose,
	onSuccess,
}: CreateConfessionModalProps) {
	const [text, setText] = useState("");
	const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [captchaToken, setCaptchaToken] = useState<string | null>(null);
	const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [deleteToken, setDeleteToken] = useState("");
	const [showCopied, setShowCopied] = useState(false);
	const maxChars = 500;

	useEffect(() => {
		if (isOpen) {
			const randomIndex = Math.floor(Math.random() * AVAILABLE_COLORS.length);
			setSelectedColor(AVAILABLE_COLORS[randomIndex]);
		}
	}, [isOpen]);

	const handleCaptchaSolve = (token: string) => {
		setCaptchaToken(token);
		setIsCaptchaVerified(true);
		setError("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!captchaToken || !isCaptchaVerified) {
			setError("Please complete the CAPTCHA verification");
			return;
		}

		setError("");
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/confessions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: text.trim(),
					color: selectedColor,
					captchaToken,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to submit confession");
			}

			if (data.deleteToken && data.confession?.id) {
				localStorage.setItem(
					`confession_${data.confession.id}`,
					data.deleteToken,
				);
				setDeleteToken(data.deleteToken);
				setShowSuccess(true);
			}

			setText("");
			const randomIndex = Math.floor(Math.random() * AVAILABLE_COLORS.length);
			setSelectedColor(AVAILABLE_COLORS[randomIndex]);
			setCaptchaToken(null);
			setIsCaptchaVerified(false);

			if (data.pending) {
				setError(
					"your confession has been submitted for review. it will appear once approved by a moderator.",
				);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
			setCaptchaToken(null);
			setIsCaptchaVerified(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCopy = (token: string) => {
		navigator.clipboard.writeText(token);
		setShowCopied(true);
		setTimeout(() => setShowCopied(false), 2000);
	};

	const handleClose = () => {
		setShowSuccess(false);
		setDeleteToken("");
		setShowCopied(false);
		onClose();
		if (showSuccess) {
			onSuccess?.();
		}
	};

	useEffect(() => {
		if (!isOpen) {
			setCaptchaToken(null);
			setIsCaptchaVerified(false);
			setText("");
			setError("");
			setShowSuccess(false);
			setDeleteToken("");
			setShowCopied(false);
		}
	}, [isOpen]);

	return (
		<>
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

						<div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
							<motion.div
								initial={{ opacity: 0, scale: 0.9, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.9, y: 20 }}
								transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
								className="pointer-events-auto relative w-full max-w-2xl"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="relative rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 bg-white">
									<button
										onClick={handleClose}
										className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full transition-colors"
										aria-label="close"
									>
										<X className="w-6 h-6" />
									</button>

									{showSuccess ? (
										<div className="space-y-6">
											<div>
												<h2 className="text-3xl font-bold text-black mb-2">
													confession submitted!
												</h2>
												<p className="text-gray-600">
													your confession has been posted. save this token if
													you want to delete it later.
												</p>
											</div>

											<div className="bg-yellow-50 border-3 border-black p-4">
												<label className="block text-sm font-bold text-black mb-2">
													deletion token:
												</label>
												<div className="flex gap-2">
													<input
														type="text"
														value={deleteToken}
														readOnly
														className="flex-1 px-4 py-2 border-2 border-black bg-white font-mono text-sm"
													/>
													<button
														type="button"
														onClick={() => handleCopy(deleteToken)}
														className="px-4 py-2 bg-black text-white font-bold border-2 border-black hover:bg-gray-800 transition-colors"
													>
														{showCopied ? "copied!" : "copy"}
													</button>
												</div>
												<p className="text-xs text-gray-600 mt-2">
													keep this token safe. you'll need it to delete your
													confession.
												</p>
											</div>

											{error && (
												<div className="p-3 bg-red-100 border-2 border-red-500 rounded text-sm text-red-700">
													{error}
												</div>
											)}

											<button
												type="button"
												onClick={handleClose}
												className="w-full px-6 py-3 bg-black text-white font-bold border-3 border-black hover:bg-gray-800 transition-colors"
											>
												done
											</button>
										</div>
									) : (
										<>
											<div className="mb-6">
												<h2 className="text-3xl font-bold text-black mb-2">
													share your story
												</h2>
												<p className="text-gray-600">
													your confession will be posted anonymously. be honest,
													be real.
												</p>
											</div>

											<form onSubmit={handleSubmit}>
												<div className="mb-4">
													<textarea
														value={text}
														onChange={(e) =>
															setText(e.target.value.slice(0, maxChars))
														}
														placeholder="i feel like an imposter when..."
														className="w-full min-h-[200px] p-4 border-3 border-black rounded-lg resize-none focus:outline-none focus:ring-4 focus:ring-black/20 text-lg"
														maxLength={maxChars}
													/>
													<div className="flex justify-between items-center mt-2 text-sm text-gray-600">
														<span>
															characters: {text.length}/{maxChars}
														</span>
													</div>
												</div>

												<div className="mb-6">
													<label className="block text-sm font-bold text-black mb-2">
														choose a color:
													</label>
													<div className="flex gap-2 flex-wrap">
														{AVAILABLE_COLORS.map((color) => (
															<button
																key={color}
																type="button"
																onClick={() => setSelectedColor(color)}
																className={`w-12 h-12 rounded-full border-3 transition-all ${
																	selectedColor === color
																		? "border-black scale-110 ring-4 ring-black/20"
																		: "border-gray-400 hover:scale-105 hover:border-black"
																}`}
																style={{ backgroundColor: color }}
																aria-label={`Select ${color}`}
															/>
														))}
													</div>
												</div>

												<div className="mb-6">
													<label className="block text-sm font-bold text-black mb-2">
														verify you're human:
													</label>
													<div className="flex justify-center">
														<CapWidget
															endpoint={`https://captcha.areyouanimposter.com/${process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}/`}
															onSolve={handleCaptchaSolve}
															onError={(message) => setError(message)}
															locale={{
																initial: "i'm a human",
																verifying: "verifying...",
																solved: "verified",
																error: "error",
															}}
															style={
																{
																	"--cap-border-radius": "8px",
																	"--cap-border-color": "#000000",
																	"--cap-checkbox-border": "3px solid #000000",
																} as React.CSSProperties
															}
														/>
													</div>
												</div>

												{error && (
													<div className="mb-4 p-3 bg-red-100 border-2 border-red-500 rounded text-sm text-red-700">
														{error}
													</div>
												)}
												<div className="flex gap-3 flex-col sm:flex-row">
													<button
														type="submit"
														disabled={
															text.trim().length === 0 ||
															!isCaptchaVerified ||
															isSubmitting
														}
														className="flex-1 px-6 py-3 bg-black text-white font-bold rounded-lg border-3 border-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
													>
														{isSubmitting
															? "submitting..."
															: "submit anonymously"}
													</button>
													<button
														type="button"
														onClick={onClose}
														disabled={isSubmitting}
														className="px-6 py-3 bg-white text-black font-bold rounded-lg border-3 border-black hover:bg-gray-100 transition-colors disabled:opacity-50"
													>
														cancel
													</button>
												</div>
											</form>
										</>
									)}
								</div>
							</motion.div>
						</div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
