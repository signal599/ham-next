import { createLogger, format, transports, type Logger } from "winston";
import { join } from "path";
import { mkdirSync } from "fs";

// Mirrors the haminfo-cli logger: JSON lines with a timestamp written to
// logs/app.log, which is shipped to New Relic. Only import this from Node.js
// runtime code (route handlers, server modules) — never from the edge proxy.

const logDir = join(process.cwd(), "logs");
mkdirSync(logDir, { recursive: true });
const logFile = join(logDir, "app.log");

const isDev = process.env.NODE_ENV !== "production";

// Cache the logger on globalThis so hot-reload in dev doesn't stack up
// duplicate file transports on every module re-evaluation.
const globalForLogger = globalThis as unknown as { hamLogger?: Logger };

const logger: Logger =
  globalForLogger.hamLogger ??
  createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.File({ filename: logFile }),
      ...(isDev
        ? [
            new transports.Console({
              format: format.combine(format.colorize(), format.simple()),
            }),
          ]
        : []),
    ],
  });

if (isDev) {
  globalForLogger.hamLogger = logger;
}

export default logger;
