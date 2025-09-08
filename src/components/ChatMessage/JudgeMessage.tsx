/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";

import { Avatar } from "@/components/Design";
import { JudgeInput } from "./JudgeInput";
import { Markdown } from "@/components/Markdown";
import { Message } from "@/shared/models";
import { Pill } from "../Design/Pill";
import { ToolExecution } from "./ToolExecution";
import styles from "./styles.module.css";

interface JudgeMessageProps {
	message: Message;
	onWidgetAction?: (action: string, data: any) => void;
}

export function JudgeMessage({ message }: JudgeMessageProps) {
	const isUser = message.role === "user";
	const isTool = message.role === "tool";

	// Check if message contains tool calls or results
	const hasToolContent =
		isTool ||
		(typeof message.content === "object" &&
			Array.isArray(message.content) &&
			message.content.some((item) => item.type === "tool-result"));

	const getPillType = (risk: string) => {
		if (risk === "critical") return "danger";
		if (risk === "high") return "warning";
		if (risk === "medium") return "warning";
		if (risk === "low") return "info";
		return "info";
	};

	const getPillText = (risk: string) => {
		if (risk === "critical") return "Critical";
		if (risk === "high") return "High";
		if (risk === "medium") return "Medium";
		if (risk === "low") return "Low";
		return risk;
	};

	const renderContent = () => {
		if (isUser) {
			return (
				<div className={styles["message-text"]}>
					<JudgeInput message={message} />
				</div>
			);
		}
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

		if (
			typeof message.content === "object" &&
			!Array.isArray(message.content)
		) {
			const renderedContent: React.ReactNode[] = [];

			if (message.content["risk"]) {
				renderedContent.push(
					<div
						key="risk"
						className={`${styles["message-text"]} ${styles["risk"]}`}
					>
						<strong>Risk:</strong>{" "}
						<Pill type={getPillType(message.content["risk"])}>
							{getPillText(message.content["risk"])}
						</Pill>
					</div>
				);
			}

			if (message.content["analysis"]) {
				renderedContent.push(
					<div key="analysis" className={styles["message-text"]}>
						<Markdown>{message.content["analysis"]}</Markdown>
					</div>
				);
			}

			if (
				message.content["violations"] &&
				message.content["violations"].length > 0
			) {
				renderedContent.push(
					<div
						key="violations"
						className={`${styles["message-text"]} ${styles["violations"]}`}
					>
						<h3>Violations:</h3>
						<pre className={styles["violations-list"]}>
							{JSON.stringify(message.content["violations"], null, 2)}
						</pre>
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
					? `${styles["assistant"]} ${styles["tool"]}`
					: isTool
					? `${styles["assistant"]} ${styles["tool"]}`
					: styles["assistant"]
			} ${hasToolContent ? styles["tool"] : ""}`}
		>
			<div className={styles["message-content"]}>
				<div className={styles["message-body"]}>{renderContent()}</div>
			</div>
		</div>
	);
}
