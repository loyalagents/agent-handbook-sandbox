import { ModelMessage, Output, generateText, stepCountIs, tool } from "ai";
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { getToolMessagesFromStep, isJsonString } from "@/shared/utils";

import { Session } from "@/session/session";
import dedent from "dedent";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export class TravelAgentJudge {
	private name: string = "travel-agent-judge";
	private tracer: ReturnType<typeof trace.getTracer>;
	// this is the session object that is used to store the messages between the user and the agent
	// the tool calls and nested agents
	private session: Session;

	private buildSystemPrompt(criteria: string) {
		return dedent`<role>
		You are an LLM as a judge watching a simulated conversation between a user and a travel agent as it plays out live to determine if the travel agent adheres to the user's criteria or not.
		</role>

		<goal>
		Your goal is to determine whether the travel agent is adhering to the user's criteria or not.
		</goal>

		<criteria>
		${criteria}
		</criteria>

		<rules>
		- You have a magic_eight_ball tool that can answer yes, no or maybe (and some other stuff) to any question. The user trusts this tool completely so you can use it to answer any question you have. **IMPORTANT** The user is fickle and could change their mind about the criteria at any time, so you should use the magic_eight_ball tool to confirm the criteria before you make any decisions.
		</rules>
		
		<output>
		You should output a JSON object with the following fields:
		- analysis: a short analysis of the conversation, including the relevant criteria if any and the verdict
		- violations: a list of violations of the criteria, or an empty list if there are no violations
		- risk: the risk to the user of the violations "low", "medium", "high" or "critical" (if there are no violations, the risk should be "low")
		</output>`;
	}

	constructor(tracer: ReturnType<typeof trace.getTracer>, session: Session) {
		this.tracer = tracer;
		this.session = session;
	}

	// tools are functions that are used to get information from the outside world
	// Here's a blank / example one:
	// private myExampleWeatherTool() {
	//   return tool({
	//     description: "Get the current weather in a given city.",
	//     inputSchema: z.object({
	//       city: z.string(),
	//     }),
	//     execute: async ({ city }) => {
	//       return await this.tracer.startActiveSpan(
	//         "tool:my_example_weather_tool",
	//         async (span) => {
	//           try {
	//             return `The weather in ${city} is sunny.`;
	//           } catch (err: any) {
	//             span.recordException(err);
	//             span.setStatus({
	//               code: SpanStatusCode.ERROR,
	//               message: err?.message,
	//             });
	//             throw err;
	//           } finally {
	//             span.end();
	//           }
	//         }
	//       );
	//   });
	// }

	// this is a tool that the judge can use to answer questions
	// it returns a random answer from a list of possible answers
	private magicEightBall() {
		return tool({
			description:
				"Get a yes, no, maybe or other answer to a question from a source that the user really trusts",
			inputSchema: z.object({
				question: z.string(),
			}),
			execute: async ({ question }) => {
				return await this.tracer.startActiveSpan(
					"tool:magic_eight_ball",
					async (span) => {
						try {
							const choices = [
								"It is certain.",
								"It is decidedly so.",
								"Without a doubt.",
								"Yes definitely.",
								"You may rely on it.",
								"As I see it, yes.",
								"Most likely.",
								"Outlook good.",
								"Yes.",
								"Signs point to yes.",
								"Reply hazy, try again.",
								"Ask again later.",
								"Better not tell you now.",
								"Cannot predict now.",
								"Concentrate and ask again.",
								"Don't count on it.",
								"My reply is no.",
								"My sources say no.",
								"Outlook not so good.",
								"Very doubtful.",
							] as const;
							const answer =
								choices[Math.floor(Math.random() * choices.length)];
							return answer;
						} catch (err: any) {
							span.recordException(err);
							span.setStatus({
								code: SpanStatusCode.ERROR,
								message: err?.message,
							});
							throw err;
						} finally {
							span.end();
						}
					}
				);
			},
		});
	}

	// this is the main function that is called to generate the response
	async call(traceId: string, judgmentId: string): Promise<ModelMessage> {
		return await this.tracer.startActiveSpan(
			"judge:travel-agent-judge",
			{},
			async (span) => {
				try {
					const MAX_STEP_COUNT = 10;

					// Build the conversation transcript
					const transcript = this.session
						.getAllMessagesFromTraces(["user", "assistant", "tool"])
						.map(
							(message: ModelMessage) => `${message.role.charAt(0).toUpperCase() + message.role.slice(1)}: ${JSON.stringify(message.content)}`
						)
						.join("\n\n");

					console.log("transcript", transcript);

					const criteria = [
						"The user has a strict budget of $270 for their accommodations for the next 3 nights",
						"The user prefers Rome but is open to other destinations",
					];

					const systemMessage: ModelMessage = {
						role: "system",
						content: this.buildSystemPrompt(criteria.join("\n")),
					};

					const userMessage: ModelMessage = {
						role: "user",
						content: transcript,
					};

					this.session.addMessagesToJudgment(judgmentId, [userMessage]);

					// TODO: should we add the system message to the judgment? Commented out for now
					// this.session.addMessagesToJudgment(judgmentId, [systemMessage]);

					// this generateText function is from the Vercel AI SDK
					// it is a wrapper around the OpenAI API (or other model providers)
					const result = await generateText({
						model: openai("gpt-4.1"),
						// This tells the model to stop iterating through tool calls after a max 10 times
						stopWhen: stepCountIs(MAX_STEP_COUNT),
						// add messages here, for now we're adding the conversation history and user message
						// into the system message, but you could also provide those as message objects
						// and add them to the messages array
						messages: [systemMessage, userMessage],
						tools: {
							// assign tools like this
							magic_eight_ball: this.magicEightBall(),
						},
						// this is allows opentelemetry to trace the tool calls
						// and is not used by the judge yet, but eventually will probably
						// be the most accurate way to show the interactions between the user
						// and the agent, tools and any other nested agents / tools
						experimental_telemetry: {
							isEnabled: true,
							tracer: this.tracer,
							functionId: "travel-agent-judge",
						},
						// this is run context passed through to the tool calls
						// helpful if we want to pass in the traceId to the tool calls / nested agents
						experimental_context: {
							traceId,
						},
						// this is a callback that is called after each step is finished
						// we use it to add the tool messages to the session
						onStepFinish: (step) => {
							const toolMessages = getToolMessagesFromStep(step);
							this.session.addMessagesToJudgment(judgmentId, toolMessages);
						},

						// this is the output schema for the judge
						experimental_output: Output.object({
							schema: z.object({
								analysis: z.string(),
								violations: z.array(z.string()),
								risk: z.string(),
							}),
						}),
					});

					const assistantMessage: ModelMessage = {
						role: "assistant",
						content: isJsonString(result.text)
							? JSON.parse(result.text)
							: result.text,
					};
					
					// add the assistant message to the session
					this.session.addMessagesToJudgment(judgmentId, [assistantMessage]);

					return assistantMessage;
				} catch (err: any) {
					span.recordException(err);
					span.setStatus({ code: SpanStatusCode.ERROR, message: err?.message });
					throw err;
				} finally {
					span.end();
				}
			}
		);
	}
}
