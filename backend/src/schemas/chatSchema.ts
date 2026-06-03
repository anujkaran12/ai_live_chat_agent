import { z } from "zod";

export const MAX_MESSAGE_CHARACTERS = 200;

export const chatRequestSchema = z.object({
  message: z
    .string({
      error: "Message is required",
    })
    .trim()
    .min(1, "Message cannot be empty")
    .max(
      MAX_MESSAGE_CHARACTERS,
      "Your message is too long. Please shorten it and try again.",
    ),
  sessionId: z
    .string({
      error: "We could not continue this chat. Please start a new message.",
    })
    .trim()
    .uuid("We could not continue this chat. Please start a new message.")
    .optional(),
});

export const chatHistoryParamsSchema = z.object({
  sessionId: z
    .string({
      error: "We could not load this chat. Please start a new message.",
    })
    .trim()
    .uuid("We could not load this chat. Please start a new message."),
});

export type ChatRequestBody = z.infer<typeof chatRequestSchema>;
