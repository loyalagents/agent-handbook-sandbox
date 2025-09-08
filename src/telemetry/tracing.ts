import { OpenInferenceBatchSpanProcessor, isOpenInferenceSpan } from "@arizeai/openinference-vercel";
import { formatSessionStart, slugify } from "@/shared/utils";

import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { JSONLinesSpanExporter } from "./json-lines-exporter";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { trace } from "@opentelemetry/api";

export class SessionTracer {
  private provider: NodeTracerProvider;
  private serviceName: string;
  private sessionId: string;
  private sessionName: string;
  private sessionNameSlug: string;
  private defaultOutFile: string;

  constructor(options: { sessionName: string, sessionId: string }) {
    this.sessionName = options.sessionName;
    this.serviceName = this.sessionName;
    this.sessionId = options.sessionId;
    this.sessionNameSlug = slugify(this.sessionName);
    this.defaultOutFile = this.getOutFile();

    
    this.provider = new NodeTracerProvider({
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: this.serviceName,
      }),
      spanProcessors: [
        new OpenInferenceBatchSpanProcessor({
          exporter: new JSONLinesSpanExporter(this.defaultOutFile),
          spanFilter: (span) => {
            // Only export spans that are OpenInference to negate non-generative spans
            // This should be removed if you want to export all spans
            // return isOpenInferenceSpan(span);

            const kind = span.attributes?.["openinference.span.kind"];
            const keep =
              span.name === "ai.generateText.doGenerate" ||
              span.name === "ai.toolCall" ||
              kind === "LLM" ||
              kind === "TOOL";
            return keep;
          },
        }),
      ],
    });
    this.provider.register();
  }

  private getOutFile() {
    const startedAt = new Date();
    const formattedStartedAt = formatSessionStart(startedAt);
    const outDir = `./db/session-traces/${this.sessionNameSlug}/${formattedStartedAt}_${this.sessionId}`;
    const outPath = `${outDir}/spans.jsonl`;
    return outPath;
  }

  getTracer() {
    return trace.getTracer(this.serviceName);
  }

  async flushTracing() {
    await this.provider.forceFlush();
  }

  async shutdown() {
    await this.provider.shutdown();
  }
}



