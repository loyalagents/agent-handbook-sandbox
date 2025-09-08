import * as React from "react";

import { JudgeMessage } from "@/components/ChatMessage";
import { SessionData, SessionJudgment } from "@/session/session";

import { Message } from "@/shared/models";
import styles from "./styles.module.css";

type JudgePanelProps = {
  judgment: SessionJudgment;
  session: SessionData;
};

const JudgePanel: React.FC<JudgePanelProps> = ({ judgment, session }) => {
  return (
    <section className={styles["judge-panel"]}>
      <div className={styles["judgment-header"]}>
        <h2>Judgment</h2>
      </div>
      <div key={judgment.id} className={styles["judgment"]}>
        <div className={styles["messages"]}>
          {judgment.messages
            .filter((message: Message) => message.role !== "system")
            .map((message: Message) => (
              <JudgeMessage key={message.id} message={message} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default JudgePanel;
