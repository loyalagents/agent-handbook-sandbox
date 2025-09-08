import { formatSessionStart, slugify } from "@/shared/utils";

import { ModelMessage } from "ai";
import fs from "fs";
import uid from "tiny-uid";

export interface SessionJudgment {
	id: string;
	traceId: string;
	timestamp: Date;
	messages: ModelMessage[];
}

export interface SessionTrace {
	id: string;
	parentId: string | null;
	timestamp: Date;
	messages: ModelMessage[];
}

export interface SessionData {
	id: string;
	name: string;
	slug: string;
	traceIds: string[];
	traces: Record<string, SessionTrace>;
	judgmentIds: string[];
	judgments: Record<string, SessionJudgment>;
	createdAt: Date;
}

export class Session {
	public scenarioId: string;
	public id: string;
	public name: string;
	public slug: string;
	public traceIds: string[];
	public traces: Record<string, SessionTrace>;
	public judgmentIds: string[];
	public judgments: Record<string, SessionJudgment>;
	public createdAt: Date;

	constructor(scenarioId: string, config: {
		id?: string;
		name?: string;
		slug?: string;
		traceIds?: string[];
		traces?: Record<string, SessionTrace>;
		judgmentIds?: string[];
		judgments?: Record<string, SessionJudgment>;
	} = {}) {
		this.scenarioId = scenarioId;
		this.id = config.id || uid();
		this.name = config.name || scenarioId;
		this.slug = config.slug || scenarioId;
		this.traceIds = config.traceIds || [];
		this.traces = config.traces || {};
		this.judgmentIds = config.judgmentIds || [];
		this.judgments = config.judgments || {};
		this.createdAt = new Date();
	}

	addTrace = (
		messages: ModelMessage[] = [],
		parentId: string | null = null
	) => {
		const trace: SessionTrace = {
			id: uid(),
			parentId,
			timestamp: new Date(),
			messages,
		};

		this.traces[trace.id] = trace;
		this.traceIds.push(trace.id);

		return trace;
	};

	addMessagesToTrace = (traceId: string, messages: ModelMessage[]) => {
		this.traces[traceId].messages.push(...messages);
	};

	getMessagesFromTrace = (
		traceId: string,
		roles: string[] = ["user", "assistant"]
	) => {
		let messages: ModelMessage[] = [];
		
		// Find the index of the provided traceId
		const traceIndex = this.traceIds.indexOf(traceId);
		if (traceIndex === -1) {
			// If traceId not found, return empty array
			return messages;
		}
		
		// Include all traces up to and including the provided traceId
		for (let i = 0; i <= traceIndex; i++) {
			const currentTraceId = this.traceIds[i];
			messages.push(...this.traces[currentTraceId].messages);
		}
		
		messages = messages.filter((message: ModelMessage) =>
			roles.includes(message.role)
		);
		return messages;
	};

	getAllMessagesFromTraces = (
		roles: string[] = ["user", "assistant", "tool", "system"]
	) => {
		let messages: ModelMessage[] = [];
		for (const traceId of this.traceIds) {
			messages.push(...this.traces[traceId].messages);
		}
		messages = messages.filter((message: ModelMessage) =>
			roles.includes(message.role)
		);
		return messages;
	};

	addJudgment = (traceId: string, messages: ModelMessage[] = []) => {
		const judgment: SessionJudgment = {
			id: uid(),
			traceId,
			timestamp: new Date(),
			messages,
		};

		this.judgments[judgment.id] = judgment;
		this.judgmentIds.push(judgment.id);

		return judgment;
	};

	addMessagesToJudgment = (judgmentId: string, messages: ModelMessage[]) => {
		this.judgments[judgmentId].messages.push(...messages);
	};

	getMessagesFromJudgment = (
		judgmentId: string | null,
		roles: string[] = ["user", "assistant", "tool"]
	) => {
		let messages: ModelMessage[] = [];
		if (judgmentId) {
			messages.push(...this.judgments[judgmentId].messages);
		} else {
			for (const judgmentId of this.judgmentIds) {
				messages.push(...this.judgments[judgmentId].messages);
			}
		}
		messages = messages.filter((message: ModelMessage) =>
			roles.includes(message.role)
		);
		return messages;
	};

	toJSON = () => {
		return {
			id: this.id,
			scenarioId: this.scenarioId,
			name: this.name,
			slug: this.slug,
			createdAt: this.createdAt,
			traceIds: this.traceIds,
			traces: this.traces,
			judgmentIds: this.judgmentIds,
			judgments: this.judgments,
		};
	};

	// save the session locally to the file system
	save = () => {
		// mkdir if not exists
		const path = `./db/scenarios/${this.scenarioId}/sessions`;
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path, { recursive: true });
		}

		// save the session to the file system
		fs.writeFileSync(
			`${path}/${this.id}.json`,
			JSON.stringify(this.toJSON(), null, 2)
		);
	};
}
