import * as React from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import styles from "./styles.module.css";
import { useBreadcrumbs } from "@/hooks";

interface ScenarioData {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

type ScenariosPageProps = {
  scenarios: ScenarioData[];
};

const ScenariosPage: React.FC<ScenariosPageProps> = ({ scenarios }) => {
  const breadcrumbs = useBreadcrumbs();

  return (
    <main className={styles["scenarios-page"]}>
      <header className={styles["header"]}>
        <Breadcrumbs items={breadcrumbs} />
      </header>
      <div className={styles["container"]}>
      <h1>Scenarios</h1>
      {scenarios.length > 0 ? (
        <ul>
          {scenarios.map((scenario) => (
            <li key={scenario.id}>
              <a href={`/scenarios/${scenario.slug}`}>{scenario.name}</a>{" "}
            </li>
          ))}
        </ul>
      ) : (
        <div>No scenarios found</div>
      )}
      </div>
    </main>
  );
};

export default ScenariosPage;
