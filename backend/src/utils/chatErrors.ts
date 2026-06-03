import type { Response } from "express";
import { ZodError } from "zod";
import { errorResponse, validationResponse, type FieldError } from "./apiResponses";

export function sendChatError(res: Response, error: unknown): void {
  if (error instanceof ZodError) {
    const errors: FieldError[] = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    validationResponse(res, errors);
    return;
  }

  const message = error instanceof Error ? error.message : String(error);

  if (message === "RATE_LIMIT") {
    errorResponse(res, 429, "You have sent a few messages quickly. Please wait a moment and try again.");
    return;
  }

  if (message === "INVALID_KEY") {
    errorResponse(res, 503, "Chat support is not available right now. Please try again later.");
    return;
  }

  if (message === "AI_NOT_READY") {
    errorResponse(res, 503, "Chat support is getting ready. Please try again in a moment.");
    return;
  }

  if (message === "LLM_ERROR") {
    errorResponse(res, 502, "Chat support is having trouble replying right now. Please try again.");
    return;
  }

  errorResponse(res, 500, "Something went wrong while sending your message. Please try again.");
}
