"use client";

import { signIn } from "@/lib/auth-client";
import { Icons } from "@/components/icons";
import { useState } from "react";

export default function SignInPage() {
	const [isLoading, setIsLoading] = useState(false);

	const handleSignIn = async () => {
		setIsLoading(true);
		try {
			await signIn.social({
				provider: "github",
				callbackURL: "/",
			});
		} catch (error) {
			console.error("Sign in error:", error);
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-white px-4">
			<div className="w-full max-w-2xl">
				<div className="relative">
					<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/60 border border-black/20 shadow-sm rotate-1 z-10" />

					<div className="relative border-3 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[#A8D5BA] p-12 rotate-[-1deg] hover:rotate-0 transition-all duration-300">
						<div className="text-center space-y-6">
							<h1
								className="text-5xl md:text-6xl font-bold text-black"
								style={{ fontFamily: "Georgia, serif" }}
							>
								moderator access
							</h1>

							<div className="space-y-4">
								<p className="text-lg text-black/80 max-w-md mx-auto leading-relaxed">
									sign in with GitHub to access moderation tools
								</p>
							</div>

							<div className="pt-6">
								<button
									onClick={handleSignIn}
									disabled={isLoading}
									className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white border-3 border-black font-bold text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? (
										<>
											<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											signing in...
										</>
									) : (
										<>
											<Icons.Github className="w-5 h-5" />
											sign in with github
										</>
									)}
								</button>
							</div>

							<div className="pt-8 border-t-2 border-black/20">
								<p className="text-sm text-black/70 font-mono">
									moderator authentication required
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
