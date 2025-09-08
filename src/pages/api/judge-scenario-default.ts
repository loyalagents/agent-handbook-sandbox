import type { NextApiRequest, NextApiResponse } from "next";

import { AgentHandbookJudge } from "@/judges/agent-handbook-judge";
import { Session } from "@/session/session";
import { SessionTracer } from "@/telemetry/tracing";
import fs from "fs";
import path from "path";
import uid from "tiny-uid";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const scenarioId =
		typeof req.query.scenario === "string" ? req.query.scenario : null;

	if (!scenarioId) {
		return res
			.status(400)
			.json({
				error:
					"scenario id is required, e.g. /api/judge-scenario-default?scenario=material-information-1",
			});
	}

	const sessionId = uid();
	const sessionName = scenarioId;

	// load the default session from the db
	const sessionPath = path.join(
		process.cwd(),
		`db/scenarios/${scenarioId}/sessions/default.json`
	);

	let sessionData: any;
	try {
		const fileContent = fs.readFileSync(sessionPath, "utf8");
		sessionData = JSON.parse(fileContent);
	} catch (error) {
		return res.status(404).json({
			error: `Default session not found for scenario: ${scenarioId}`,
			path: sessionPath,
		});
	}

  console.log("sessionData", sessionData);

	// create a session from the loaded data, this contains the messages between the user and the agent
	// the tool calls and nested agents, as well as the judge's messages
	const session = new Session(scenarioId, {
		name: sessionData.name,
		slug: sessionData.slug,
		traceIds: sessionData.traceIds,
		traces: sessionData.traces,
	});

	// create a new session tracer, this is used to trace the spans and traces
	// using opentelemetry, this isn't used by the judge yet, but could be in the future
	const sessionTracer = new SessionTracer({ sessionName, sessionId });
	const tracer = sessionTracer.getTracer();

	// create a new judge, this is used to analyze the conversation and determine if the travel agent is adhering to the user's criteria
	const judge = new AgentHandbookJudge(tracer, session);


	try {

    // loop through all the traces from the default session and add a judgment to each trace
		for (const traceId of session.traceIds) {
			// add a new judgment to the session
			const judgment = session.addJudgment(traceId);

			// call the judge to analyze the conversation
			await judge.call(traceId, judgment.id);
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
