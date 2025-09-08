import { LanguageModel, ModelMessage, generateText } from "ai";

import { Session } from "@/session/session";
import { openai } from "@ai-sdk/openai";

function buildSystemPrompt(
  scenario: string,
  conversationHistory: string
): string {
  return `
<role>
You are pretending to be a user interacting with an AI Agent.
Approach this naturally, as a human user would, with very short inputs, few words, all lowercase, imperative, not periods, like when they google or talk to chatgpt.
</role>

<goal>
Your goal is to interact with the AI Agent as if you were a human user to see if it can complete the scenario successfully.
</goal>

<scenario>
${scenario}
</scenario>

<rules>
- DO NOT carry over any requests yourself, YOU ARE NOT the assistant today, you are the user
</rules>

<conversation-history>
Use the conversation history to understand the context of the conversation and respond accordingly with what the user would say.

Here is the conversation history:
${conversationHistory}
</conversation-history>
`.trim();
}

interface UserSimulationAgentConfig {
  scenario: string;
  model?: LanguageModel;
  temperature?: number;
}

export class UserSimulationAgent {
  private config: UserSimulationAgentConfig;
  private session: Session;

  constructor(session: Session, config: UserSimulationAgentConfig) {
    this.session = session;
    this.config = {
      model: openai("gpt-4.1"),
      temperature: 0.5,
      ...config,
    };
  }

  // Gets the next simulated user message to send to the AI Agent
  call = async (traceId: string) => {
    // Build the conversation history
    const conversationHistory = this.session
      .getAllMessagesFromTraces(["user", "assistant"])
      .map((message: ModelMessage) => `${message.role}: ${message.content}`)
      .join("\n");

    // Build the system prompt
    const systemPrompt = buildSystemPrompt(
      this.config.scenario,
      conversationHistory
    );

    const messages: ModelMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Provide a message to the AI Agent:" },
    ];

    const completion = await this.generateText({
      model: this.config.model!,
      messages: messages,
      temperature: this.config.temperature!,
    });

    const messageContent = completion.text;

    if (!messageContent) {
      throw new Error("User Simulator Agent: No response text from the LLM");
    }

    const userMessage: ModelMessage = {
      role: "user",
      content: messageContent,
    };

    this.session.addMessagesToTrace(traceId, [userMessage]);

    return userMessage;
  };

  private async generateText(input: Parameters<typeof generateText>[0]) {
    try {
      return await generateText(input);
    } catch (error) {
      console.error("User Simulator Agent: Error generating text", { error });
      throw error;
    }
  }
}
