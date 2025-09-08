import * as React from "react";

import styles from "./styles.module.css";

const HomePage: React.FC = () => {
	return (
		<main className={styles["home-page"]}>
			{/* <header className={styles["header"]}></header> */}
			<div className={styles["container"]}>
				<h1>Agent Handbook Evaluation</h1>
				<ul>
					<li>
						<a href={`/scenarios`}>Scenarios</a>
					</li>
				</ul>
			</div>
		</main>
	);
};

export default HomePage;
