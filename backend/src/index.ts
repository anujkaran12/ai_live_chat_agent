import "dotenv/config";
import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import chatRouter from "./routes/chatRouter";
import { initLLM } from "./services/llmService";
import { errorResponse } from "./utils/apiResponses";

const app = express();

const PORT = process.env.PORT || 3001;
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);

app.use(express.json({ limit: "64kb" }));
app.use("/chat", chatRouter);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (isPayloadTooLargeError(error)) {
    errorResponse(res, 413, "Your message is too large. Please shorten it and try again.");
    return;
  }

  if (isJsonParseError(error)) {
    errorResponse(res, 400, "We could not understand that request. Please try again.");
    return;
  }

  const status = getHttpErrorStatus(error);

  errorResponse(res, status, "Something went wrong while sending your message. Please try again.");
});

async function startServer(): Promise<void> {
  await initLLM();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`Unable to start server: ${message}`);
  process.exitCode = 1;
});

function getHttpErrorStatus(error: unknown): number {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }

  return 500;
}

function isPayloadTooLargeError(error: unknown): boolean {
  return getHttpErrorStatus(error) === 413;
}

function isJsonParseError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const status = getHttpErrorStatus(error);

  return (
    status === 400 &&
    (error instanceof SyntaxError ||
      ("type" in error && error.type === "entity.parse.failed") ||
      error.message.toLowerCase().includes("json"))
  );
}
