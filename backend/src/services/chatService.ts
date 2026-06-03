import {
  createConversation,
  findConversationById,
} from "../repositories/conversationRepository";
import {
  findMessagesByConversationId,
  saveMessage,
} from "../repositories/messageRepository";
import { MAX_MESSAGE_CHARACTERS } from "../schemas/chatSchema";
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

  const normalizedText = normalizeMessageText(text);
  const history = await findMessagesByConversationId(activeSessionId);

  await saveMessage(activeSessionId, "user", normalizedText.text);
  const reply = await generateReply(history, normalizedText.text);
  await saveMessage(activeSessionId, "ai", reply);

  return {
    reply,
    sessionId: activeSessionId,
    message: normalizedText.text,
    warning: warning ?? normalizedText.warning,
  };
}

function normalizeMessageText(text: string): { text: string; warning?: string } {
  if (text.length <= MAX_MESSAGE_CHARACTERS) {
    return { text };
  }

  return {
    text: text.slice(0, MAX_MESSAGE_CHARACTERS),
    warning: `Your message was longer than ${MAX_MESSAGE_CHARACTERS} characters, so only the first ${MAX_MESSAGE_CHARACTERS} characters were sent.`,
  };
}
