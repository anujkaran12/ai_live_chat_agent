import type { Request, Response } from "express";
import { findMessagesByConversationId } from "../repositories/messageRepository";
import { chatHistoryParamsSchema, chatRequestSchema } from "../schemas/chatSchema";
import { handleMessage } from "../services/chatService";
import { successResponse } from "../utils/apiResponses";
import { sendChatError } from "../utils/chatErrors";

export async function sendMessage(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const parsed = chatRequestSchema.parse(req.body);
    const result = await handleMessage(parsed.sessionId, parsed.message);

    successResponse(res, 200, "Message sent successfully", result);
  } catch (error) {
    sendChatError(res, error);
  }
}

export async function getHistory(
  req: Request<{ sessionId: string }>,
  res: Response,
): Promise<void> {
  try {
    const parsed = chatHistoryParamsSchema.parse(req.params);
    const messages = await findMessagesByConversationId(parsed.sessionId);

    successResponse(res, 200, "Chat history fetched successfully", messages);
  } catch (error) {
    sendChatError(res, error);
  }
}
