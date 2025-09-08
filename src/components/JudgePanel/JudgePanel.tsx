import * as React from "react";

import { Cross2Icon } from "@radix-ui/react-icons";
import { IconButton } from "@/components/Design/Button";
import { JudgeMessage } from "@/components/ChatMessage";
import { SessionData, SessionJudgment } from "@/session/session";

import { Message } from "@/shared/models";
import styles from "./styles.module.css";

type JudgePanelProps = {
  judgment: SessionJudgment;
  session: SessionData;
  onClose: () => void;
};

const JudgePanel: React.FC<JudgePanelProps> = ({ judgment, session, onClose }) => {
  return (
    <section className={styles["judge-panel"]}>
      <div className={styles["judgment-header"]}>
        <h2>Judgment</h2>
        <div className={styles["judgment-actions"]}>
          <IconButton
            icon={<Cross2Icon />}
            onClick={onClose}
            size="large"
            variant="default"
          />
        </div>
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
