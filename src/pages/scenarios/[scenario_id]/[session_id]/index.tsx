import { GetStaticPaths, GetStaticProps } from "next";

import { ScenarioData } from "@/shared/models";
import { SessionData } from "@/session/session";
import { SessionPage } from "@/components/SessionPage";
import fs from "fs";
import path from "path";

interface PageProps {
	session: SessionData | null;
	scenario: ScenarioData | null;
}

export default function Page({ session, scenario }: PageProps) {
	return session && scenario ? (
		<SessionPage session={session} scenario={scenario} />
	) : null;
}

export const getStaticPaths: GetStaticPaths = async () => {
	const scenariosDir = path.join(process.cwd(), "db", "scenarios");

	try {
		const scenarioDirs = fs
			.readdirSync(scenariosDir, { withFileTypes: true })
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name);

		const paths: Array<{
			params: { scenario_id: string; session_id: string };
		}> = [];

		for (const scenarioId of scenarioDirs) {
			const sessionsDir = path.join(scenariosDir, scenarioId, "sessions");
			if (fs.existsSync(sessionsDir)) {
				const sessionFiles = fs.readdirSync(sessionsDir);
				const jsonFiles = sessionFiles.filter((file) => file.endsWith(".json"));

				for (const file of jsonFiles) {
					const sessionId = file.replace(".json", "");
					paths.push({
						params: {
							scenario_id: scenarioId,
							session_id: sessionId,
						},
					});
				}
			}
		}

		return {
			paths,
			fallback: false,
		};
	} catch (error) {
		console.error("Error reading scenarios directory:", error);
		return {
			paths: [],
			fallback: false,
		};
	}
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const sessionId = params?.session_id as string;
	const scenarioId = params?.scenario_id as string;

	if (!sessionId || !scenarioId) {
		return {
			notFound: true,
		};
	}

	try {
		// Read scenario data
		const scenarioPath = path.join(
			process.cwd(),
			"db",
			"scenarios",
			scenarioId,
			"index.json"
		);
		const scenarioContent = fs.readFileSync(scenarioPath, "utf8");
		const scenario: ScenarioData = JSON.parse(scenarioContent);

		// Read session data
		const sessionPath = path.join(
			process.cwd(),
			"db",
			"scenarios",
			scenarioId,
			"sessions",
			`${sessionId}.json`
		);
		const sessionContent = fs.readFileSync(sessionPath, "utf8");
		const session: SessionData = JSON.parse(sessionContent);

		return {
			props: {
				session,
				scenario,
			},
		};
	} catch (error) {
		console.error(
			`Error reading session ${sessionId} or scenario ${scenarioId}:`,
			error
		);
		return {
			props: {
				session: null,
				scenario: null,
			},
		};
	}
};
