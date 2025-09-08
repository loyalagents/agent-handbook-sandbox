import { ModelMessage } from "ai";
import { ScenarioData } from "@/shared/models";
import { SessionData } from "@/session/session";
import { useMemo, useState, useEffect } from "react";

interface UseMessageNavigationOptions {
	session: SessionData;
	scenario: ScenarioData;
	roles?: string[];
	parentId?: string | null;
}

interface MessageWithMeta extends ModelMessage {
	traceId: string;
	messageIndex: number;
	traceIndex: number;
}

interface UseMessageNavigationResult {
	allMessages: MessageWithMeta[];
	currentMessageIndex: number;
	currentMessage?: MessageWithMeta;
	messagesUpToCurrent: ModelMessage[];
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
							name: message.role === "user" ? "User" : scenario.name,
							traceId,
							messageIndex,
							traceIndex,
						});
					});
				}
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
	const goToPrevious = () => setCurrentMessageIndex(Math.max(0, currentMessageIndex - 1));
	const goToNext = () => setCurrentMessageIndex(Math.min(allMessages.length - 1, currentMessageIndex + 1));
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
