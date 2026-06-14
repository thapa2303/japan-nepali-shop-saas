import { createApp } from "./app.js";
import { logger } from "./lib/logger.js";

const rawPort = process.env["PORT"] ?? "8080";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const app = createApp();

app.listen(port, () => {
  logger.info({ port }, "API server started");
});
