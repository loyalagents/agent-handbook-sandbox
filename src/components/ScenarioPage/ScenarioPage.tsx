import * as React from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import { ScenarioData } from "@/shared/models";
import { SessionData } from "@/session/session";
import styles from "./styles.module.css";
import { useBreadcrumbs } from "@/hooks";

type ScenarioPageProps = {
	scenario: ScenarioData;
	sessions: SessionData[];
};

const ScenarioPage: React.FC<ScenarioPageProps> = ({ scenario, sessions }) => {
	const breadcrumbs = useBreadcrumbs({ scenario });

	return (
		<main className={styles["scenario-page"]}>
			<header className={styles["header"]}>
				<Breadcrumbs items={breadcrumbs} />
			</header>
			<div className={styles["container"]}>
        <h1>{scenario?.name}</h1>
				{sessions.length > 0 ? (
					<ul>
						{sessions.map((session) => (
							<li key={session.id}>
								<a
									href={`/scenarios/${scenario.id}/${session.id}`}
								>
									{session.id}
								</a>{" "}
								<span className={styles["date"]}>
									{new Date(
										session.createdAt
									).toLocaleString()}
								</span>
							</li>
						))}
					</ul>
				) : (
					<div>No sessions found</div>
				)}
			</div>
		</main>
	);
};

export default ScenarioPage;
