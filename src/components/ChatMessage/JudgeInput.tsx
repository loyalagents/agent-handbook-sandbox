import * as React from "react";

import { CaretDownIcon, CaretRightIcon } from "@radix-ui/react-icons";

import { Message } from "@/shared/models";
import styles from "./styles.module.css";

interface JudgeInputProps {
  message: Message;
}

export function JudgeInput({ message }: JudgeInputProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Helper function to create truncated JSON summary
  const getTruncatedSummary = () => {
    const summary = message.content as string;
    return summary.length > 80 ? summary.substring(0, 80) + "..." : summary;
  };

  return (
    <div className={`${styles["tool-execution"]} ${styles["judge-input"]}`}>
      <div className={styles["tool-execution-header"]} onClick={toggleExpanded}>
        <div className={styles["tool-header-content"]}>
          <span className={styles["tool-name"]}>input</span>
          {!isExpanded && (
            <span className={styles["tool-summary"]}>
              {getTruncatedSummary()}
            </span>
          )}
        </div>
        <span className={`${styles["caret"]}`}>
          {isExpanded ? (
            <CaretDownIcon width={20} height={20} />
          ) : (
            <CaretRightIcon width={20} height={20} />
          )}
        </span>
      </div>

      {isExpanded && (
        <div className={styles["tool-execution-details"]}>
          <div className={styles["tool-call"]}>
            <div className={styles["tool-call-input"]}>
              <pre>{message.content as string}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
