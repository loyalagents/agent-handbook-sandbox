import { GetStaticProps } from "next";
import { ScenarioData } from "@/shared/models";
import { ScenariosPage } from "@/components/ScenariosPage";
import fs from "fs";
import path from "path";

interface PageProps {
	scenarios: ScenarioData[];
}

export default function Page({ scenarios }: PageProps) {
	return <ScenariosPage scenarios={scenarios} />;
}

export const getStaticProps: GetStaticProps = async () => {
	const scenariosDir = path.join(process.cwd(), "db", "scenarios");

	try {
		const scenarioDirs = fs
			.readdirSync(scenariosDir, { withFileTypes: true })
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name);

		const scenarios: ScenarioData[] = [];

		for (const dirName of scenarioDirs) {
			const indexPath = path.join(scenariosDir, dirName, "index.json");

			if (fs.existsSync(indexPath)) {
				try {
					const fileContent = fs.readFileSync(indexPath, "utf8");
					const data = JSON.parse(fileContent);

					scenarios.push({
						id: data.id,
						name: data.name,
						slug: data.slug,
						createdAt: data.createdAt,
					});
				} catch (error) {
					console.error(`Error reading scenario ${dirName}:`, error);
				}
			}
		}

		// Sort by creation date (newest first)
		scenarios.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

		return {
			props: {
				scenarios,
			},
		};
	} catch (error) {
		console.error("Error reading scenarios:", error);
		return {
			props: {
				scenarios: [],
			},
		};
	}
};
