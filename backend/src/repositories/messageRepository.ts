import { v4 as uuidv4 } from "uuid";
import db from "../db/knex";
import type { Message } from "../types";

export async function saveMessage(
  conversationId: string,
  sender: "user" | "ai",
  text: string,
): Promise<Message> {
  const message: Message = {
    id: uuidv4(),
    conversation_id: conversationId,
    sender,
    text,
    created_at: new Date().toISOString(),
  };

  await db("messages").insert(message);

  return message;
}

export async function findMessagesByConversationId(
  conversationId: string,
): Promise<Message[]> {
  return db<Message>("messages")
    .where({ conversation_id: conversationId })
    .orderBy("created_at", "asc");
}
