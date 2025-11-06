"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { DeleteManagerModal } from "./delete-manager-modal";

interface FAQItemProps {
	question: string;
	answer: string | React.ReactNode;
	index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1, duration: 0.6 }}
			className="border-4 border-black bg-white"
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
			>
				<span className="text-base md:text-lg font-bold text-black text-left">
					{question}
				</span>
				<motion.svg
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.3 }}
					className="w-6 h-6 flex-shrink-0 ml-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={3}
						d="M19 9l-7 7-7-7"
					/>
				</motion.svg>
			</button>

			<motion.div
				initial={false}
				animate={{
					height: isOpen ? "auto" : 0,
					opacity: isOpen ? 1 : 0,
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="overflow-hidden"
			>
				<div className="px-6 py-4 border-t-4 border-black bg-gray-50">
					<div className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
						{answer}
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}

export function FAQSection() {
	const [showDeleteManager, setShowDeleteManager] = useState(false);

	const faqs = [
		{
			question: "why anonymous?",
			answer:
				"anonymity captures authenticity. when there's no name attached, there's no performance. these confessions represent the raw, unfiltered experience of feeling like you don't belong—even when you do.",
		},
		{
			question: "how is data used?",
			answer:
				"your data is not collected or stored by this site. the only data processing occurs through necessary services like cloudflare for basic website functionality and security. your ip address is tracked but anonymized to protect your privacy (hashed).",
		},
		{
			question: "how is content moderated?",
			answer:
				"currently, moderation is handled through captcha verification and anti-bot measures. this helps ensure authentic submissions while maintaining the anonymous nature of the platform. all confessions are meant to reflect genuine experiences with imposter syndrome.",
		},
		{
			question: "how do i delete my confession?",
			answer: (
				<div className="space-y-4">
					<p>
						you need your deletion token that was provided when you submitted
						your confession. if you saved it, click the button below to manage
						your deletions.
					</p>
					<button
						onClick={() => setShowDeleteManager(true)}
						className="px-6 py-3 bg-red-500 text-white font-bold border-3 border-black hover:bg-red-600 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
					>
						manage deletions
					</button>
					<p className="text-sm">
						don't have your token? contact{" "}
						<a href="mailto:hi@heybob.by" className="underline font-bold">
							hi@heybob.by
						</a>
					</p>
				</div>
			),
		},
	];

	return (
		<>
			<div className="max-w-3xl mx-auto space-y-4">
				{faqs.map((faq, index) => (
					<FAQItem
						key={index}
						question={faq.question}
						answer={faq.answer}
						index={index}
					/>
				))}
			</div>
			<DeleteManagerModal
				isOpen={showDeleteManager}
				onClose={() => setShowDeleteManager(false)}
			/>
		</>
	);
}
