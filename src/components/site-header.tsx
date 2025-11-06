"use client";

import { motion, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";

export function SiteHeader() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const letterVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
		},
	};

	const title = "are you an imposter?";

	const titleAnimationDelay = title.length * 0.05;

	return (
		<motion.header
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.8 }}
			className="bg-white"
		>
			<div className="max-w-7xl mx-auto px-4 py-12 md:py-14 pb-6 md:pb-8 flex flex-col items-center text-center">
				<div className="w-full px-2">
					<motion.h1
						className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-black tracking-tight overflow-hidden whitespace-nowrap"
						initial={{
							scale: 1,
							y: isMobile ? 0 : 50,
						}}
						animate={{
							scale: 1,
							y: 0,
						}}
						transition={{
							delay: titleAnimationDelay + 0.8,
							duration: 1.2,
							ease: [0.25, 0.1, 0.25, 1],
						}}
					>
						{title.split("").map((char, i) => (
							<motion.span
								key={i}
								variants={letterVariants}
								initial="hidden"
								animate="visible"
								transition={{
									delay: i * 0.05,
									duration: 0.6,
									ease: [0.25, 0.1, 0.25, 1] as any,
								}}
								className="inline-block"
								style={{ display: "inline-block" }}
							>
								{char === " " ? "\u00A0" : char}
							</motion.span>
						))}
					</motion.h1>
				</div>
			</div>
		</motion.header>
	);
}
