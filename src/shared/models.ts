export type ParentType = "trace" | "span" | undefined;

export interface Span {
  id: string;
  name: string;
  parentId: string | undefined;
  parentType: ParentType;
  traceId: string;
  interactionId: string;
  data: Record<string, unknown>;
  createdAt: Date;
}

export interface Trace {
  id: string;
  name: string;
  parentId: string | undefined;
  parentType: ParentType;
  interactionId: string;
  createdAt: Date;
}

export interface ScenarioData {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'tool' | 'system' | 'judge';
  content: string | Record<string, any> | Array<{
    type: string;
    toolCallId?: string;
    toolName?: string;
    input?: any;
    output?: any;
    [key: string]: any;
  }>;
  id?: string;
  name?: string;
  parentId?: string;
  createdAt?: string;
  judgmentId?: string;
}