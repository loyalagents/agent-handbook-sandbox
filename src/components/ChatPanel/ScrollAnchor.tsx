"use client";

// https://github.com/vercel-labs/ai-chatbot/blob/614963271bf6f588e4d35b747aeacad395876f31/components/chat-scroll-anchor.tsx

import * as React from "react";

import styles from "./styles.module.css";
import { useInView } from "react-intersection-observer";

interface ScrollAnchorProps {
	trackVisibility?: boolean;
	containerRef?: React.RefObject<HTMLElement | null>;
	messageCount?: number;
}

export function ScrollAnchor({ trackVisibility, containerRef, messageCount }: ScrollAnchorProps) {
	const { ref, entry, inView } = useInView({
		trackVisibility,
		delay: 100,
		rootMargin: "0px 0px -30px 0px",
		root: containerRef?.current,
	});

	const previousMessageCount = React.useRef(messageCount);
	const [hasNewMessage, setHasNewMessage] = React.useState(false);

	React.useEffect(() => {
		if (messageCount !== undefined && messageCount > (previousMessageCount.current || 0)) {
			setHasNewMessage(true);
			previousMessageCount.current = messageCount;
		}
	}, [messageCount]);

	React.useEffect(() => {
		if (trackVisibility && !inView && hasNewMessage) {
			entry?.target.scrollIntoView({
				block: "start",
				behavior: "smooth",
			});
			setHasNewMessage(false);
		}
	}, [inView, entry, trackVisibility, hasNewMessage]);

	return <div ref={ref} className={styles["scroll-anchor"]} />;
}
