import type { NextApiRequest, NextApiResponse } from "next";

import { Session } from "@/session/session";
import { SessionTracer } from "@/telemetry/tracing";
import { TravelAgent } from "@/agents/travel-agent";
import { TravelAgentJudge } from "@/judges/travel-agent-judge";
import { UserSimulationAgent } from "@/agents/user-simulation-agent";
import uid from "tiny-uid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const scenarioId = "travel-agent"
  const sessionId = uid();
  const sessionName = "Travel Agent";

  // create a new session, sessions are used to store the messages between the user and the agent
  // the tool calls and nested agents, as well as the judge's messages
  const session = new Session(scenarioId);

  // create a new session tracer, this is used to trace the spans and traces
  // using opentelemetry, this isn't used by the judge yet, but could be in the future
  const sessionTracer = new SessionTracer({ sessionName, sessionId });
  const tracer = sessionTracer.getTracer();

  // this is the maximum number of iterations to run
  const MAX_ITERATIONS = 4;

  // create a new user simulation agent, this is used to simulate the user's messages
  const userSimulationAgent = new UserSimulationAgent(session, {
    scenario: `The user is planning a boat trip from Barcelona to Rome,
        and is wondering what the weather will be like.

        Then the user will ask for different accommodation options.`,
  });

  // create a new travel agent, this is used to generate the travel agent's messages
  const travelAgent = new TravelAgent(tracer, session);

  // create a new judge, this is used to analyze the conversation and determine if the travel agent is adhering to the user's criteria
  const judge = new TravelAgentJudge(tracer, session);

  try {
    let iteration = 0;

    // loop through the iterations
    while (iteration < MAX_ITERATIONS) {
      // add a new trace to the session
      const trace = session.addTrace();

      // call the user simulation agent, which will add a user message to the trace
      await userSimulationAgent.call(trace.id);

      // call the travel agent, which will add an assistant message (and tool calls) to the trace
      await travelAgent.call(trace.id);

      // add a new judgment to the session
      const judgment = session.addJudgment(trace.id);

      // call the judge to analyze the conversation
      await judge.call(trace.id, judgment.id);

      // increment the iteration
      iteration++;
    }

    // when we're done, save the session to the db
    session.save();

    // send the session to the client
    res.status(200).json(session.toJSON());
  } catch (e: any) {
    res.status(500).json({
      error: e?.message || "error",
      sessionId,
      sessionName,
    });
  } finally {
    await sessionTracer.flushTracing();
    await sessionTracer.shutdown();
  }
}
