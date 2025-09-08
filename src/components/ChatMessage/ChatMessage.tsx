/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";

import { Avatar } from "@/components/Design";
import { Markdown } from "@/components/Markdown";
import { Message } from "@/shared/models";
import { ToolExecution } from "./ToolExecution";
import styles from "./styles.module.css";

interface ChatMessageProps {
	message: Message;
	onJudgeDetails?: (message: Message) => void;
	onWidgetAction?: (action: string, data: any) => void;
}

export function ChatMessage({ message, onJudgeDetails }: ChatMessageProps) {
	const isUser = message.role === "user";
	const isTool = message.role === "tool";
	const isJudge = message.role === "judge";

	// Check if message contains tool calls or results
	const hasToolContent =
		isTool ||
		(typeof message.content === "object" &&
			Array.isArray(message.content) &&
			message.content.some((item) => item.type === "tool-result"));

	const renderContent = () => {
		if (typeof message.content === "string") {
			return (
				<div className={styles["message-text"]}>
					<Markdown>{message.content}</Markdown>
				</div>
			);
		}

		// Handle tool messages with the new format
		if (isTool && Array.isArray(message.content)) {
			const renderedContent: React.ReactNode[] = [];

			// Group tool results by toolCallId in case there are multiple results for the same call
			const toolGroups = new Map<string, any[]>();

			message.content.forEach((item: any) => {
				if (item.type === "tool-result" && item.toolCallId) {
					const existing = toolGroups.get(item.toolCallId) || [];
					existing.push(item);
					toolGroups.set(item.toolCallId, existing);
				}
			});

			toolGroups.forEach((items, toolCallId) => {
				// Use the first item to get tool name and input (should be the same for grouped items)
				const firstItem = items[0];

				// Create a synthetic tool call from the tool result data
				const syntheticToolCall = {
					toolName: firstItem.toolName,
					input: firstItem.input,
				};

				// Create synthetic tool results
				const syntheticToolResults = items.map((item) => ({
					output: item.output,
				}));

				renderedContent.push(
					<ToolExecution
						key={toolCallId}
						toolCallId={toolCallId}
						toolCall={syntheticToolCall}
						toolResults={syntheticToolResults}
					/>
				);
			});

			// Handle any non-tool-result content
			message.content.forEach((item: any, index: number) => {
				if (item.type !== "tool-result") {
					renderedContent.push(
						<div key={`unknown-${index}`} className={styles["unknown-content"]}>
							<pre>{JSON.stringify(item, null, 2)}</pre>
						</div>
					);
				}
			});

			return renderedContent;
		}



		if (typeof message.content === "object" && !Array.isArray(message.content)) {
			const renderedContent: React.ReactNode[] = [];

			if (message.content["analysis"]) {
				renderedContent.push(
					<div key="analysis" className={styles["message-text"]}>
						<Markdown>{message.content["analysis"]}</Markdown>
					</div>
				);
			}

			return renderedContent;
		}
	};

	return (
		<div
			className={`${styles["message"]} ${
				isUser
					? styles["user"]
					: isJudge
					? styles["judge"]
					: isTool
					? `${styles["assistant"]} ${styles["tool"]}`
					: styles["assistant"]
			} ${hasToolContent ? styles["tool"] : ""}`}
		>
			<div className={styles["message-avatar"]}>
				{message.role === "judge" ? (
					<Avatar name="Judge" role={message.role} />
				) : (
					<Avatar name={["assistant", "system", "tool"].includes(message.role) ? "Robot" : "Bob"} role={message.role} />
				)}
			</div>
			<div className={styles["message-content"]}>
				{isJudge ? (
					<>
					<div className={styles["message-body"]}>{renderContent()}</div>
					<div className={styles["message-actions"]}><a onClick={() => onJudgeDetails?.(message)}>See details</a></div>
					</>
				) : (
					<div className={styles["message-body"]}>{renderContent()}</div>
				)}
			</div>
		</div>
	);
}

export function LoadingMessage() {
	return (
		<div className={`${styles["message"]} ${styles["assistant"]}`}>
			<div className={styles["message-avatar"]}>
				<Avatar name="Loading" />
			</div>
			<div className={styles["message-content"]}>
				<div className={styles["message-body"]}>
					<div className={styles["loading"]}>
						<span>...</span>
					</div>
				</div>
			</div>
		</div>
	);
}
