import { ScenarioData, Message } from "@/shared/models";
import { SessionData } from "@/session/session";
import { useMemo, useState, useEffect } from "react";

interface UseMessageNavigationOptions {
  session: SessionData;
  scenario: ScenarioData;
  roles?: string[];
  judgmentRiskLevels?: string[];
  parentId?: string | null;
}

interface MessageWithMeta extends Message {
  traceId: string;
  messageIndex: number;
  traceIndex: number;
}

interface UseMessageNavigationResult {
  allMessages: MessageWithMeta[];
  currentMessageIndex: number;
  currentMessage?: MessageWithMeta;
  messagesUpToCurrent: Message[];
  setCurrentMessageIndex: (index: number) => void;
  goToFirst: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  goToLast: () => void;
  isFirstMessage: boolean;
  isLastMessage: boolean;
  totalMessages: number;
  currentTraceId?: string;
}

export const useMessageNavigation = ({
  session,
  scenario,
  roles = ["user", "assistant", "system", "tool"],
  judgmentRiskLevels = ["low", "medium", "high", "critical"],
  parentId = null,
}: UseMessageNavigationOptions): UseMessageNavigationResult => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);

  // Build a flat list of all messages with metadata
  const allMessages = useMemo(() => {
    if (!session) {
      return [];
    }

    const messages: MessageWithMeta[] = [];
    const includedTraceIds = session.traceIds || [];

    includedTraceIds.forEach((traceId, traceIndex) => {
      const trace = session.traces?.[traceId];
      if (trace && trace.messages) {
        // Filter by parentId if specified
        if (parentId === null || trace.parentId === parentId) {
          const filteredMessages = trace.messages.filter((message) =>
            roles.includes(message.role)
          );

          filteredMessages.forEach((message, messageIndex) => {
            messages.push({
              ...message,
              traceId,
              messageIndex,
              traceIndex,
            });
          });
        }

        // find any judgments for this trace
        const judgments = session.judgmentIds
          .filter(
            (judgmentId) => session.judgments[judgmentId].traceId === traceId
          )
          .map((judgmentId) => session.judgments[judgmentId]);

        // and add them to the messages to display in UI
        judgments.forEach((judgment) => {
          // find the final message in the judgment
          const finalMessage = judgment.messages
            .filter((message) => message.role === "assistant")
            .pop();

          // get the risk level from the final message in a type safe way
          const risk =
            (typeof finalMessage?.content === "object" &&
              !Array.isArray(finalMessage?.content) &&
              finalMessage?.content?.risk) ||
            "";

          // if the risk is in the display risk levels, add the judgment message to the messages
          if (judgmentRiskLevels.includes(risk)) {
            messages.push({
              role: "judge",
              content: finalMessage?.content || "",
              judgmentId: judgment.id,
              traceId,
              messageIndex: judgment.messages.length - 1,
              traceIndex,
            });
          }
        });
      }
    });

    return messages;
  }, [session, parentId, scenario, roles]);

  // Get messages up to and including the current message
  const messagesUpToCurrent = useMemo(() => {
    return allMessages
      .slice(0, currentMessageIndex + 1)
      .map(({ traceId, messageIndex, traceIndex, ...message }) => message);
  }, [allMessages, currentMessageIndex]);

  // Reset to first message when session changes
  useEffect(() => {
    if (allMessages.length > 0 && currentMessageIndex >= allMessages.length) {
      setCurrentMessageIndex(0);
    }
  }, [allMessages.length, currentMessageIndex]);

  // Navigation functions
  const goToFirst = () => setCurrentMessageIndex(0);
  const goToPrevious = () =>
    setCurrentMessageIndex(Math.max(0, currentMessageIndex - 1));
  const goToNext = () =>
    setCurrentMessageIndex(
      Math.min(allMessages.length - 1, currentMessageIndex + 1)
    );
  const goToLast = () => setCurrentMessageIndex(allMessages.length - 1);

  const currentMessage = allMessages[currentMessageIndex];
  const isFirstMessage = currentMessageIndex === 0;
  const isLastMessage = currentMessageIndex === allMessages.length - 1;

  return {
    allMessages,
    currentMessageIndex,
    currentMessage,
    messagesUpToCurrent,
    setCurrentMessageIndex,
    goToFirst,
    goToPrevious,
    goToNext,
    goToLast,
    isFirstMessage,
    isLastMessage,
    totalMessages: allMessages.length,
    currentTraceId: currentMessage?.traceId,
  };
};
