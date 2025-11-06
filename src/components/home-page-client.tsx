"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { SiteHeader } from "@/components/site-header";
import { StorySection } from "@/components/story-section";
import { ConfessionCard } from "@/components/confession-card";
import { ConfessionModal } from "@/components/confession-modal";
import { CreateConfessionModal } from "@/components/create-confession-modal";
import { ModerationPanel } from "@/components/moderation-panel";
import { ViewCounter } from "@/components/view-counter";
import { Plus, Settings } from "lucide-react";

interface Confession {
	id: number;
	text: string;
	color: string;
	date: string;
	createdAt: number;
}

interface HomePageClientProps {
	isModerator: boolean;
}

export function HomePageClient({ isModerator }: HomePageClientProps) {
	const [messages, setMessages] = useState<Confession[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedConfession, setSelectedConfession] =
		useState<Confession | null>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isModPanelOpen, setIsModPanelOpen] = useState(false);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [cursor, setCursor] = useState<number | null>(null);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [submissionsPaused, setSubmissionsPaused] = useState(false);
	const loadingRef = useRef(false);

	const fetchConfessions = useCallback(
		async (cursorValue: number | null = null) => {
			if (loadingRef.current || (!hasMore && cursorValue !== null)) return;

			loadingRef.current = true;
			setIsLoading(true);
			try {
				const url = cursorValue
					? `/api/confessions?cursor=${cursorValue}&limit=12`
					: `/api/confessions?limit=12`;

				const response = await fetch(url);
				const data = await response.json();

				if (data.confessions) {
					if (cursorValue === null) {
						setMessages(data.confessions);
					} else {
						setMessages((prev) => [...prev, ...data.confessions]);
					}

					setCursor(data.nextCursor);
					setHasMore(data.hasMore);
				}
			} catch (error) {
				console.error("Error fetching confessions:", error);
			} finally {
				setIsLoading(false);
				loadingRef.current = false;
				if (isInitialLoad) setIsInitialLoad(false);
			}
		},
		[hasMore, isInitialLoad],
	);

	useEffect(() => {
		fetchConfessions();

		fetch("/api/settings")
			.then((res) => res.json())
			.then((data) => setSubmissionsPaused(data.submissionsPaused || false))
			.catch(() => {});

		const params = new URLSearchParams(window.location.search);
		const confessionId = params.get("confession");
		if (confessionId) {
			const id = parseInt(confessionId);
			setTimeout(() => {
				const element = document.getElementById(`confession-${id}`);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "center" });
					const confession = messages.find((m) => m.id === id);
					if (confession) {
						setSelectedConfession(confession);
					}
				}
			}, 500);
		}
	}, []);

	useEffect(() => {
		if (isInitialLoad) return;

		let timeoutId: NodeJS.Timeout;

		const handleScroll = () => {
			clearTimeout(timeoutId);

			timeoutId = setTimeout(() => {
				if (loadingRef.current || !hasMore) return;

				const scrollHeight = document.documentElement.scrollHeight;
				const scrollTop = document.documentElement.scrollTop;
				const clientHeight = document.documentElement.clientHeight;

				if (scrollTop + clientHeight >= scrollHeight - 800) {
					fetchConfessions(cursor);
				}
			}, 100);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
			clearTimeout(timeoutId);
		};
	}, [cursor, hasMore, isInitialLoad, fetchConfessions]);

	const filteredMessages = useMemo(() => {
		if (!searchQuery.trim()) return messages;

		const query = searchQuery.toLowerCase();
		return messages.filter((msg) => msg.text.toLowerCase().includes(query));
	}, [messages, searchQuery]);

	const handleNewConfession = () => {
		fetchConfessions();
		setIsCreateModalOpen(false);
	};

	const toggleSelect = (id: number) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	return (
		<>
			<div className="min-h-screen bg-white">
				<SiteHeader />

				<StorySection
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					resultsCount={filteredMessages.length}
				/>

				{submissionsPaused && (
					<div className="max-w-7xl mx-auto px-4 py-4">
						<div className="border-3 border-black bg-yellow-100 p-4 text-center">
							<p className="font-bold">⚠️ Submissions are currently paused</p>
							<p className="text-sm text-gray-700">
								New confessions cannot be submitted at this time. Please check
								back later.
							</p>
						</div>
					</div>
				)}

				<main className="max-w-7xl mx-auto px-4 py-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{filteredMessages.map((confession, index) => (
							<ConfessionCard
								key={`confession-${confession.id}-${index}`}
								id={confession.id}
								text={confession.text}
								color={confession.color}
								date={confession.date}
								createdAt={confession.createdAt}
								index={index}
								onClick={() => setSelectedConfession(confession)}
								showModeratorTools={isModerator}
								onDelete={() => {
									setMessages((prev) =>
										prev.filter((c) => c.id !== confession.id),
									);
								}}
								isSelected={selectedIds.includes(confession.id)}
								onToggleSelect={
									isModerator ? () => toggleSelect(confession.id) : undefined
								}
							/>
						))}
					</div>

					{isLoading && (
						<div className="flex justify-center items-center py-12">
							<div className="relative">
								<motion.div
									className="absolute w-24 h-32 border-3 border-black bg-[#8B9DC3] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
									animate={{
										rotate: [-5, 5, -5],
										y: [0, -8, 0],
									}}
									transition={{
										duration: 1.5,
										repeat: Infinity,
										ease: "easeInOut",
									}}
								/>
								<motion.div
									className="absolute w-24 h-32 border-3 border-black bg-[#A8D5BA] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
									animate={{
										rotate: [5, -5, 5],
										y: [0, -8, 0],
									}}
									transition={{
										duration: 1.5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 0.2,
									}}
								/>
								<motion.div
									className="w-24 h-32 border-3 border-black bg-[#DDA15E] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
									animate={{
										rotate: [-3, 3, -3],
										y: [0, -8, 0],
									}}
									transition={{
										duration: 1.5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 0.4,
									}}
								/>
							</div>
						</div>
					)}

					{!isLoading && filteredMessages.length === 0 && searchQuery && (
						<div className="text-center py-20">
							<p className="text-xl text-gray-500">
								no confessions found matching "{searchQuery}"
							</p>
							<button
								onClick={() => setSearchQuery("")}
								className="mt-4 text-black underline hover:no-underline"
							>
								clear search
							</button>
						</div>
					)}

					{!isLoading && messages.length === 0 && !searchQuery && (
						<div className="text-center py-20">
							<p className="text-xl text-gray-500">
								no confessions yet. be the first to share.
							</p>
						</div>
					)}
				</main>

				<footer className="mt-20 bg-white relative">
					<svg
						className="w-full h-4"
						viewBox="0 0 1200 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						preserveAspectRatio="none"
					>
						<path
							d="M0 8 C 20 4, 35 11, 55 7 C 75 3, 90 12, 110 8 S 145 5, 165 9 C 185 12, 205 5, 225 8 S 260 11, 280 7 C 300 4, 315 10, 335 7 S 370 4, 390 9 C 410 13, 430 6, 450 8 S 485 11, 505 7 C 525 4, 540 11, 560 8 S 595 5, 615 9 C 635 12, 655 5, 675 8 S 710 11, 730 7 C 750 4, 765 10, 785 7 S 820 4, 840 9 C 860 13, 880 6, 900 8 S 935 11, 955 7 C 975 4, 990 11, 1010 8 S 1045 5, 1065 9 C 1085 12, 1105 5, 1125 8 S 1160 11, 1180 7 L 1200 8"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-black"
						/>
					</svg>
					<div className="max-w-7xl mx-auto px-4 py-6">
						<div className="flex items-center justify-center gap-2 sm:gap-3 text-xs text-black/60 font-mono flex-wrap">
							<a
								href="https://github.com/iamnotbobby/are-you-an-imposter"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-black transition-colors"
							>
								source code
							</a>
							<span className="hidden sm:inline">•</span>
							<span className="text-center">
								a project exploring lack of fit and belonging
							</span>
							<span className="hidden sm:inline">•</span>
							<ViewCounter />
						</div>
						<div className="text-center mt-2 text-xs text-black/40 font-mono">
							created for university of nevada las vegas (COLA)
						</div>
					</div>
				</footer>

				<button
					onClick={() => setIsCreateModalOpen(true)}
					disabled={submissionsPaused}
					className="fixed bottom-8 right-8 w-16 h-16 bg-black text-white rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center group border-3 border-black z-30 disabled:opacity-50 disabled:cursor-not-allowed"
					aria-label="Create new confession"
				>
					<Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
				</button>

				{isModerator && (
					<button
						onClick={() => setIsModPanelOpen(true)}
						className="fixed bottom-28 right-8 w-16 h-16 bg-white text-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center group border-3 border-black z-30"
						aria-label="Moderation Panel"
					>
						<Settings className="w-7 h-7" />
					</button>
				)}

				<ConfessionModal
					confession={selectedConfession}
					isOpen={!!selectedConfession}
					onClose={() => setSelectedConfession(null)}
					showModeratorTools={isModerator}
					onDelete={() => {
						if (selectedConfession) {
							setMessages((prev) =>
								prev.filter((c) => c.id !== selectedConfession.id),
							);
							setSelectedConfession(null);
						}
					}}
					onEdit={(id, text) => {
						setMessages((prev) =>
							prev.map((c) => (c.id === id ? { ...c, text } : c)),
						);
						if (selectedConfession) {
							setSelectedConfession({ ...selectedConfession, text });
						}
					}}
				/>

				<CreateConfessionModal
					isOpen={isCreateModalOpen}
					onClose={() => setIsCreateModalOpen(false)}
					onSuccess={handleNewConfession}
				/>

				<ModerationPanel
					isOpen={isModPanelOpen}
					onClose={() => setIsModPanelOpen(false)}
					onRefresh={() => {
						setMessages([]);
						setCursor(null);
						setHasMore(true);
						fetchConfessions();
					}}
					selectedIds={selectedIds}
					setSelectedIds={setSelectedIds}
					allConfessions={messages}
				/>
			</div>
		</>
	);
}
