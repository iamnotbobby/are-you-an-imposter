"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex h-screen w-full items-center justify-center bg-white px-4">
			<div className="w-full max-w-2xl">
				<div className="relative">
					<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/60 border border-black/20 shadow-sm rotate-[-2deg] z-10" />

					<div className="relative border-3 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[#CE6A85] p-12 rotate-[1deg] hover:rotate-0 transition-all duration-300">
						<div className="text-center space-y-6">
							<div
								className="text-6xl md:text-7xl font-bold text-black"
								style={{ fontFamily: "Georgia, serif" }}
							>
								!
							</div>

							<div className="space-y-4">
								<p
									className="text-2xl md:text-3xl font-medium text-black"
									style={{ fontFamily: "Georgia, serif" }}
								>
									"something went wrong..."
								</p>
								<p className="text-lg text-black/80 max-w-md mx-auto leading-relaxed">
									it's not you, it's us. even websites feel like imposters
									sometimes.
								</p>
								{error?.digest && (
									<p className="text-xs text-black/60 font-mono break-all px-4">
										{error.digest}
									</p>
								)}
							</div>

							<div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
								<button
									onClick={reset}
									className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white border-3 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
								>
									<RotateCcw className="w-4 h-4" />
									try again
								</button>
								<Link
									href="/"
									className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black border-3 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
								>
									go home
								</Link>
							</div>

							<div className="pt-8 border-t-2 border-black/20">
								<p className="text-sm text-black/70 font-mono">
									error: unexpected_failure
								</p>
							</div>
						</div>

						<div className="absolute bottom-0 right-0 w-0 h-0 border-l-[24px] border-l-transparent border-b-[24px] border-b-black/30" />
					</div>
				</div>
			</div>
		</div>
	);
}
