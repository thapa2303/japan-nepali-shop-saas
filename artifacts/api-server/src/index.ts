import { createApp } from "./app.js";
import { logger } from "./lib/logger.js";

const PORT = parseInt(process.env.PORT ?? "8080", 10);

const app = createApp();

app.listen(PORT, () => {
  logger.info({ port: PORT }, "API server started");
});
