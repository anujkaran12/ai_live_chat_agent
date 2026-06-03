import { z } from "zod";

export const MAX_MESSAGE_CHARACTERS = 2000;
export const MAX_REQUEST_MESSAGE_CHARACTERS = 10000;

export const chatRequestSchema = z.object({
  message: z
    .string({
      error: "Message is required",
    })
    .trim()
    .min(1, "Message cannot be empty")
    .max(
      MAX_REQUEST_MESSAGE_CHARACTERS,
      `Message is too large. Please keep it under ${MAX_REQUEST_MESSAGE_CHARACTERS} characters`,
    ),
  sessionId: z
    .string({
      error: "Session id must be a string",
    })
    .trim()
    .uuid("Session id must be a valid UUID")
    .optional(),
});

export type ChatRequestBody = z.infer<typeof chatRequestSchema>;
