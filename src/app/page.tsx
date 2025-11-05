import { Suspense } from "react";
import { getModeratorStatus } from "@/lib/moderation";
import { HomePageClient } from "@/components/home-page-client";

async function ModeratorWrapper() {
	const isModerator = await getModeratorStatus();
	return <HomePageClient isModerator={isModerator} />;
}

export default function HomePage() {
	return (
		<Suspense fallback={<HomePageClient isModerator={false} />}>
			<ModeratorWrapper />
		</Suspense>
	);
}
