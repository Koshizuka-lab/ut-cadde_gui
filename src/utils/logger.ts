/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import pino from "pino";

export function getLogger(name?: string) {
  if (process.env.NODE_ENV === "production") {
    const logger = pino(
      {
        transport: {
          target: "pino-pretty",
        },
        name: name,
        level: process.env.LOG_LEVEL ?? "info",
        formatters: {
          level: (label) => ({ level: label }),
          bindings: (bindings) => ({
            pid: bindings.pid,
            hostname: bindings.hostname,
            name: bindings.name,
          }),
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      pino.destination(2), // stderr
    );
    return logger;
  } else {
    const logger = pino(
      {
        name: name,
        level: process.env.LOG_LEVEL ?? "info",
        formatters: {
          level: (label) => ({ level: label }),
          bindings: (bindings) => ({
            pid: bindings.pid,
            hostname: bindings.hostname,
            name: bindings.name,
          }),
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      pino.destination(1), // stdout
    );
    return logger;
  }
}