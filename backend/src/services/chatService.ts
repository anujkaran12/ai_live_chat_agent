import {
  createConversation,
  findConversationById,
} from "../repositories/conversationRepository";
import {
  findMessagesByConversationId,
  saveMessage,
} from "../repositories/messageRepository";
import type { ChatResponse } from "../types";
import { generateReply } from "./llmService";

export async function handleMessage(
  sessionId: string | undefined,
  text: string,
): Promise<ChatResponse> {
  let activeSessionId = sessionId?.trim() || "";
  let warning: string | undefined;

  if (!activeSessionId) {
    activeSessionId = await createConversation();
  } else {
    const conversation = await findConversationById(activeSessionId);

    if (!conversation) {
      activeSessionId = await createConversation();
      warning = "Your previous chat session was not found, so a new chat was started.";
    }
  }

  const history = await findMessagesByConversationId(activeSessionId);

  await saveMessage(activeSessionId, "user", text);
  const reply = await generateReply(history, text);
  await saveMessage(activeSessionId, "ai", reply);

  return {
    reply,
    sessionId: activeSessionId,
    message: text,
    warning,
  };
}
