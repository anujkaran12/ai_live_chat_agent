import type { Request, Response } from "express";
import { findMessagesByConversationId } from "../repositories/messageRepository";
import { chatRequestSchema } from "../schemas/chatSchema";
import { handleMessage } from "../services/chatService";
import { errorResponse, successResponse } from "../utils/apiResponses";
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
    const messages = await findMessagesByConversationId(req.params.sessionId);

    successResponse(res, 200, "Chat history fetched successfully", messages);
  } catch {
    errorResponse(res, 500, "Could not load chat history. Please try again");
  }
}
