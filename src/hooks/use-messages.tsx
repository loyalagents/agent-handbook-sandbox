import { ModelMessage } from "ai";
import { ScenarioData } from "@/shared/models";
import { SessionData } from "@/session/session";
import { useMemo } from "react";

interface UseMessagesOptions {
	session: SessionData;
	scenario: ScenarioData;
    traceIds?: string[];
	roles?: string[];
	parentId?: string | null;
}

export const useMessages = ({
	session,
	scenario,
	traceIds,
	roles = ["user", "assistant", "system", "tool"],
	parentId = null,
}: UseMessagesOptions): ModelMessage[] => {
	return useMemo(() => {
		if (!session) {
			return [];
		}

		const messages: ModelMessage[] = [];

		// Extract messages from traces
		const includedTraceIds = traceIds || session.traceIds || [];

		for (const traceId of includedTraceIds) {
			const trace = session.traces?.[traceId];
			if (trace && trace.messages) {
				// Filter by roles if specified
				if (roles) {
					trace.messages = trace.messages.filter((message) => roles.includes(message.role));
				}

				// Filter by parentId if specified
				if (parentId === null || trace.parentId === parentId) {
					messages.push(
						...trace.messages.map((message) => {
							return {
								...message,
								name: message.role === "user" ? "User" : scenario.name,
							};
						})
					);
				}
			}
		}

		return messages;
	}, [session, parentId, scenario, traceIds]);
};
