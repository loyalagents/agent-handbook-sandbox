import * as React from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useBreadcrumbs, useMessageNavigation } from "@/hooks";

import Breadcrumbs from "@/components/Breadcrumbs";
import { ChatPanel } from "@/components/ChatPanel";
import { IconButton } from "@/components/Design/Button";
import { SideModal } from "@/components/Design/Modal";
import { JudgePanel } from "@/components/JudgePanel";
import { Message, ScenarioData } from "@/shared/models";
import { SessionData, SessionJudgment } from "@/session/session";
import styles from "./styles.module.css";
import { useState } from "react";

type SessionPageProps = {
  session: SessionData;
  scenario: ScenarioData;
};

const SessionPage: React.FC<SessionPageProps> = ({ session, scenario }) => {
  const breadcrumbs = useBreadcrumbs({ scenario, session });
  const [activeJudgment, setActiveJudgment] = useState<SessionJudgment>();
  const handleOnJudgeDetails = (message: Message) => {
    if (message.judgmentId) {
      setActiveJudgment(session.judgments[message.judgmentId]);
    }
  };

  // Use message navigation instead of trace navigation
  const {
    messagesUpToCurrent,
    currentMessageIndex,
    goToPrevious,
    goToNext,
    isFirstMessage,
    isLastMessage,
    totalMessages,
  } = useMessageNavigation({
    session,
    scenario,
    roles: ["user", "assistant", "tool", "judge"],
    judgmentRiskLevels: ["high", "critical"],
  });

  return (
    <div className={styles["session-page"]}>
      <header className={styles["header"]}>
        <Breadcrumbs items={breadcrumbs} hideCurrent={false} />

        {totalMessages > 1 && (
          <div className={styles["navigation-controls"]}>
            <span className={styles["trace-counter"]}>
              Message {currentMessageIndex + 1} of {totalMessages}
            </span>
            <div className={styles["navigation-buttons"]}>
              {/* <IconButton
                icon=
                size="small"
                variant="text"
                disabled={isFirstMessage}
                onClick={goToFirst}
                aria-label="Go to first message"
              /> */}
              <IconButton
                icon={<ChevronLeftIcon />}
                size="small"
                variant="text"
                disabled={isFirstMessage}
                onClick={goToPrevious}
                aria-label="Go to previous message"
              />
              <IconButton
                icon={<ChevronRightIcon />}
                size="small"
                variant="text"
                disabled={isLastMessage}
                onClick={goToNext}
                aria-label="Go to next message"
              />
              {/* <IconButton
                icon="⏭"
                size="small"
                variant="text"
                disabled={isLastMessage}
                onClick={goToLast}
                aria-label="Go to last message"
              /> */}
            </div>
          </div>
        )}
      </header>
      <div className={styles["container"]}>
        <ChatPanel
          messages={messagesUpToCurrent}
          onJudgeDetails={handleOnJudgeDetails}
        />
        {activeJudgment && (
          <SideModal open={true} onClose={() => setActiveJudgment(undefined)}>
            <JudgePanel session={session} judgment={activeJudgment} onClose={() => setActiveJudgment(undefined)} />
          </SideModal>
        )}
      </div>
    </div>
  );
};

export default SessionPage;
