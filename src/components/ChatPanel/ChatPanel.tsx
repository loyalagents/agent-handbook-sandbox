import * as React from "react";

import { ChatMessage } from "@/components/ChatMessage";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { Message } from "@/shared/models";
import { ScrollAnchor } from "./ScrollAnchor";
import styles from "./styles.module.css";

type ChatPanelProps = {
	messages: Message[];
	onJudgeDetails?: (message: Message) => void;
};

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onJudgeDetails }) => {
	const containerRef = React.useRef<HTMLElement | null>(null);

	return (
		<section ref={containerRef} className={styles["chat-panel"]}>
			<div className={styles["messages"]}>
				{messages.length > 0 ? (
					<>
						{messages.map((message: Message) => (
							<ChatMessage key={message.id} message={message} onJudgeDetails={onJudgeDetails} />
						))}
						<ScrollAnchor trackVisibility containerRef={containerRef} messageCount={messages.length} />
					</>
				) : (
					<>
						<div className={styles["empty-state"]}>
							<div className={styles["empty-state-icon"]}>
								<MagicWandIcon />
							</div>
							<div className={styles["empty-state-content"]}>
								No messages found
							</div>
						</div>
					</>
				)}
			</div>
		</section>
	);
};

export default ChatPanel;
