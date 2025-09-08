import { GetStaticPaths, GetStaticProps } from "next";

import { ScenarioData } from "@/shared/models";
import { ScenarioPage } from "@/components/ScenarioPage";
import { SessionData } from "@/session/session";
import fs from "fs";
import path from "path";

interface PageProps {
	scenario: ScenarioData;
	sessions: SessionData[];
}

export const getStaticPaths: GetStaticPaths = async () => {
	try {
		const scenariosDir = path.join(process.cwd(), "db", "scenarios");
		const scenarioDirs = fs
			.readdirSync(scenariosDir, { withFileTypes: true })
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name);

		const paths = scenarioDirs.map((scenarioId) => ({
			params: { scenario_id: scenarioId },
		}));

		return {
			paths,
			fallback: false, // Return 404 for any paths not generated at build time
		};
	} catch (error) {
		console.error("Error reading scenarios directory:", error);
		return {
			paths: [],
			fallback: false,
		};
	}
};

export default function Page({ scenario, sessions }: PageProps) {
	return <ScenarioPage scenario={scenario} sessions={sessions} />;
}

export const getStaticProps: GetStaticProps = async (params) => {
	const scenarioId = params?.params?.scenario_id as string;
	console.log("scenarioId", scenarioId);

	if (!scenarioId) {
		return {
			notFound: true,
		};
	}

	try {
		const scenarioDir = path.join(process.cwd(), "db", "scenarios", scenarioId);
		const scenarioIndexPath = path.join(scenarioDir, "index.json");
		const fileContent = fs.readFileSync(scenarioIndexPath, "utf8");
		const scenario: ScenarioData = JSON.parse(fileContent);

		const sessionsDir = path.join(scenarioDir, "sessions");
		const sessionFiles = fs.readdirSync(sessionsDir);
		const jsonFiles = sessionFiles.filter((file) => file.endsWith(".json"));

		const sessions: SessionData[] = jsonFiles.map((file) => {
			const filePath = path.join(sessionsDir, file);
			const fileContent = fs.readFileSync(filePath, "utf8");
			return JSON.parse(fileContent);
		});

		// Sort by creation date (newest first)
		sessions.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

		return {
			props: {
				scenario,
				sessions,
			},
		};
	} catch (error) {
		console.error("Error reading sessions:", error);
		return {
			props: {
				scenario: null,
				sessions: [],
			},
		};
	}
};
