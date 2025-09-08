import { ModelMessage, ToolCallPart, ToolResultPart } from "ai";

export const getStepMessages = (step: Record<string, unknown>) => {
	const stepContent = step.content as Array<Record<string, unknown>>;

	return stepContent.map((part) => {
		let message: ModelMessage | undefined;
		if (part.type === "text") {
			message = {
				role: "assistant",
				content: part.text as string,
			};
		} else if (part.type === "tool-call") {
			message = {
				role: "assistant",
				content: [part as unknown as ToolCallPart],
			};
		} else if (part.type === "tool-result") {
			message = {
				role: "assistant",
				content: [part as unknown as ToolResultPart],
			};
		}

		return message;
	});
};

export const getToolMessagesFromStep = (step: Record<string, unknown>) => {
	const stepContent = step.content as Array<Record<string, unknown>>;
	const toolMessages: ModelMessage[] = [];

	stepContent.forEach((part) => {
		let message: ModelMessage;
		if (part.type === "tool-result") {
			message = {
				role: "tool",
				content: [part as unknown as ToolResultPart],
			};
			toolMessages.push(message);
		}
	});

	return toolMessages;
};

export const slugify = (input: string): string => {
	return input
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80);
};

export const formatSessionStart = (d: Date): string => {
	// Example format: 1_02_2025_9:30:02
	const month = d.getMonth() + 1; // 1-12
	const day = d.getDate().toString().padStart(2, "0");
	const year = d.getFullYear();
	const hours = d.getHours();
	const minutes = d.getMinutes().toString().padStart(2, "0");
	const seconds = d.getSeconds().toString().padStart(2, "0");
	return `${month}_${day}_${year}_${hours}:${minutes}:${seconds}`;
};

export const isJsonString = (str: string): boolean => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};
