import { ModelMessage, generateText, stepCountIs, tool } from "ai";
import { SpanStatusCode, trace } from "@opentelemetry/api";

import { Session } from "@/session/session";
import dedent from "dedent";
import { getToolMessagesFromStep } from "@/shared/utils";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export class TravelAgent {
	private name: string = "travel-agent";
	private tracer: ReturnType<typeof trace.getTracer>;
	// this is the session object that is used to store the messages between the user and the agent
	// the tool calls and nested agents
	private session: Session;

	private buildSystemPrompt(conversationHistory: string, userMessage: string) {
		return dedent`You are a helpful travel agent that uses tools. 
      Do not guess the city if missing.

      Message History:
      ${conversationHistory}

      User Message: 
      ${userMessage}
    `;
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

	// this is a tool that is used to get the current weather in a given city
	// it returns fake data
	private getCurrentWeather() {
		return tool({
			description: "Get the current weather in a given city.",
			inputSchema: z.object({
				city: z.string(),
				date_range: z.string(),
			}),
			execute: async ({ city, date_range }) => {
				return await this.tracer.startActiveSpan(
					"tool:get_current_weather",
					async (span) => {
						try {
							const choices = ["sunny", "cloudy", "rainy", "snowy"] as const;
							const temperature = Math.floor(Math.random() * 31);
							const weather =
								choices[Math.floor(Math.random() * choices.length)];
							return `The weather in ${city} is ${weather} with a temperature of ${temperature}°C.`;
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

	// this is a tool that is used to get the accommodation in a given city
	// it returns fake data
	private getAccommodation() {
		return tool({
			description: "Get the accommodation in a given city.",
			inputSchema: z.object({
				city: z.string(),
				weather: z.enum(["sunny", "cloudy", "rainy", "snowy"] as const),
			}),
			execute: async ({ city, weather }) => {
				return await this.tracer.startActiveSpan(
					"tool:get_accommodation",
					async (span) => {
						try {
							if (weather === "sunny") {
								return [
									"Water Park Inn - $100 per night",
									"Beach Resort La Playa - $150 per night",
									"Hotelito - $200 per night",
								];
							}
							if (weather === "cloudy" || weather === "rainy") {
								return [
									"Hotel Barcelona - $100 per night",
									"Hotel Rome - $150 per night",
									"Hotel Venice - $200 per night",
								];
							}
							if (weather === "snowy") {
								return [
									"Mountains Peak Lodge - $100 per night",
									"Snowy Mountain Inn - $150 per night",
									"Snowy Mountain Resort - $200 per night",
								];
							}
							throw new Error(`Invalid weather: ${weather}`);
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
	async call(traceId: string): Promise<ModelMessage> {
		return await this.tracer.startActiveSpan(
			"agent:travel-agent",
			{},
			async (span) => {
				try {
					const MAX_STEP_COUNT = 10;

					// Build the conversation history
					const conversationHistory = this.session
						.getAllMessagesFromTraces(["user", "assistant"])
						.slice(0, -1)
						.map(
							(message: ModelMessage) => `${message.role}: ${message.content}`
						)
						.join("\n");

          console.log("conversationHistory", conversationHistory)

					const userMessage = this.session
						.getAllMessagesFromTraces(["user"])
						.slice(-1)[0];

					console.log("userMessage", userMessage)

					const systemMessage: ModelMessage = {
						role: "system",
						content: this.buildSystemPrompt(
							conversationHistory,
							userMessage.content as string
						),
					};

					this.session.addMessagesToTrace(traceId, [systemMessage]);

					// this generateText function is from the Vercel AI SDK
					// it is a wrapper around the OpenAI API (or other model providers)
					const result = await generateText({
						model: openai("gpt-4.1"),
						// This tells the model to stop iterating through tool calls after a max 10 times
						stopWhen: stepCountIs(MAX_STEP_COUNT),
						// add messages here, for now we're adding the conversation history and user message
						// into the system message, but you could also provide those as message objects
						// and add them to the messages array
						messages: [systemMessage],
						tools: {
							// assign tools like this
							get_current_weather: this.getCurrentWeather(),
							get_accommodation: this.getAccommodation(),
						},
						// this is allows opentelemetry to trace the tool calls
						// and is not used by the judge yet, but eventually will probably
						// be the most accurate way to show the interactions between the user
						// and the agent, tools and any other nested agents / tools
						experimental_telemetry: {
							isEnabled: true,
							tracer: this.tracer,
							functionId: "travel-agent",
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
							this.session.addMessagesToTrace(traceId, toolMessages);
						},
					});

					const assistantMessage: ModelMessage = {
						role: "assistant",
						content: result.text,
					};
					// add the assistant message to the session
					this.session.addMessagesToTrace(traceId, [assistantMessage]);

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
