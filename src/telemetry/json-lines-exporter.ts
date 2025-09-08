import { ReadableSpan, SpanExporter } from "@opentelemetry/sdk-trace-base";

import fs from "node:fs";
import path from "node:path";

type Result = {
  code: number;
  error?: Error;
};

/**
 * JSON lines exporter that routes spans to per-session files.
 * The target file is derived from the first span that carries the
 * attribute `session.file` and is cached for all spans with the same traceId.
 */
export class JSONLinesSpanExporter implements SpanExporter {
  private traceIdToStream: Map<
    string,
    { stream: fs.WriteStream; path: string }
  > = new Map();
  private defaultStream: fs.WriteStream | null = null;
  private defaultFilePath: string;

  constructor(defaultFilePath: string) {
    this.defaultFilePath = defaultFilePath;
  }

  private ensureStream(filePath: string): fs.WriteStream {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    return fs.createWriteStream(filePath, { flags: "a" });
  }

  private getStreamForSpan(span: ReadableSpan): fs.WriteStream {
    const traceId = span.spanContext().traceId;
    const existing = this.traceIdToStream.get(traceId);

    if (existing) {
      return existing.stream;
    }

    const filePath = this.defaultFilePath;
    const stream = this.ensureStream(filePath);
    this.traceIdToStream.set(traceId, { stream, path: filePath });
    return stream;
  }

  export(
    spans: ReadableSpan[],
    resultCallback: (result: Result) => void
  ): void {
    try {
      for (const span of spans) {
        const stream = this.getStreamForSpan(span);
        const record = {
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
          parentSpanId: span.parentSpanContext?.spanId ?? null,
          name: span.name,
          kind: span.kind,
          startTime: span.startTime[0] * 1e9 + span.startTime[1], // converts the OpenTelemetry HrTime tuple [seconds, nanoseconds] into a single nanoseconds-since-epoch number: seconds × 1e9 + nanoseconds.
          endTime: span.endTime[0] * 1e9 + span.endTime[1],
          attributes: span.attributes,
          status: span.status,
          resource: span.resource.attributes,
        };
        stream.write(JSON.stringify(record) + "\n");
      }
      resultCallback({ code: 0 });
    } catch (error: any) {
      resultCallback({ code: 1, error });
    }
  }

  async shutdown(): Promise<void> {
    const streams = [
      ...Array.from(this.traceIdToStream.values()).map((v) => v.stream),
      ...(this.defaultStream ? [this.defaultStream] : []),
    ];
    await Promise.all(
      streams.map(
        (s) =>
          new Promise<void>((resolve) => {
            s.end(resolve);
          })
      )
    );
    this.traceIdToStream.clear();
    this.defaultStream = null;
  }
}
