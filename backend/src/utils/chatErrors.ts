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
    errorResponse(res, 429, "Too many requests, please wait a moment");
    return;
  }

  if (message === "INVALID_KEY") {
    errorResponse(res, 503, "AI service configuration error");
    return;
  }

  if (message === "AI_NOT_READY") {
    errorResponse(res, 503, "AI service is still starting. Please try again in a moment");
    return;
  }

  if (message === "LLM_ERROR") {
    errorResponse(res, 502, "AI service is unavailable right now. Please try again");
    return;
  }

  errorResponse(res, 500, "Something went wrong, please try again");
}
