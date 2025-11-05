import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex h-screen w-full items-center justify-center bg-white px-4">
			<div className="w-full max-w-2xl">
				<div className="relative">
					<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/60 border border-black/20 shadow-sm rotate-1 z-10" />

					<div className="relative border-3 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[#F4A5A5] p-12 rotate-[-1deg] hover:rotate-0 transition-all duration-300">
						<div className="text-center space-y-6">
							<h1
								className="text-8xl md:text-9xl font-bold text-black"
								style={{ fontFamily: "Georgia, serif" }}
							>
								404
							</h1>

							<div className="space-y-4">
								<p
									className="text-2xl md:text-3xl font-medium text-black"
									style={{ fontFamily: "Georgia, serif" }}
								>
									"maybe you don't belong here..."
								</p>
								<p className="text-lg text-black/80 max-w-md mx-auto leading-relaxed">
									just kidding. the page you're looking for doesn't exist, but
									that doesn't mean you're lost.
								</p>
							</div>

							<div className="pt-6">
								<Link
									href="/"
									className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white border-3 border-black font-bold text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
								>
									go back home
								</Link>
							</div>

							<div className="pt-8 border-t-2 border-black/20">
								<p className="text-sm text-black/70 font-mono">
									error: page_not_found
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
