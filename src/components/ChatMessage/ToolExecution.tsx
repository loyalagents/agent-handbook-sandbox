import * as React from "react";

import { CaretDownIcon, CaretRightIcon } from "@radix-ui/react-icons";

import styles from "./styles.module.css";

interface ToolExecutionProps {
  toolCallId: string;
  toolCall: {
    toolName?: string;
    input?: any;
    [key: string]: any;
  };
  toolResults: Array<{
    output?: any;
    [key: string]: any;
  }>;
}

export function ToolExecution({
  toolCallId,
  toolCall,
  toolResults,
}: ToolExecutionProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Helper function to create truncated JSON summary
  const getTruncatedSummary = () => {
    const inputStr = toolCall.input ? JSON.stringify(toolCall.input) : "";
    
    let outputSummary = "";
    if (toolResults.length === 1) {
      const output = toolResults[0].output;
      outputSummary = output 
        ? (typeof output === "string" ? output : JSON.stringify(output))
        : "";
    } else if (toolResults.length > 1) {
      outputSummary = `${toolResults.length} results`;
    }
    
    const summary = [];
    if (inputStr) {
      const truncatedInput = inputStr.length > 30 ? inputStr.substring(0, 30) + "..." : inputStr;
      summary.push(`in: ${truncatedInput}`);
    }
    if (outputSummary) {
      const truncatedOutput = outputSummary.length > 30 ? outputSummary.substring(0, 30) + "..." : outputSummary;
      summary.push(`out: ${truncatedOutput}`);
    }
    
    const fullSummary = summary.join(" | ");
    return fullSummary.length > 80 ? fullSummary.substring(0, 80) + "..." : fullSummary;
  };

  return (
    <div className={styles["tool-execution"]}>
      <div className={styles["tool-execution-header"]} onClick={toggleExpanded}>
        <div className={styles["tool-header-content"]}>
          <span className={styles["tool-name"]}>
            {toolCall.toolName || "Tool Call"}
          </span>
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
              <pre>
                <div className={styles["tool-call-header"]}>input</div>
                {toolCall.input
                  ? JSON.stringify(toolCall.input, null, 2)
                  : "No input provided"}
              </pre>
            </div>
          </div>

          {toolResults.map((result, idx) => (
            <div
              key={`${toolCallId}-result-${idx}`}
              className={styles["tool-result"]}
            >
              <div className={styles["tool-result-output"]}>
                <pre>
                  <div className={styles["tool-result-header"]}>output</div>
                  {result.output
                    ? typeof result.output === "string"
                      ? result.output
                      : JSON.stringify(result.output, null, 2)
                    : "No output provided"}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
