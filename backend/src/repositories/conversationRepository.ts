import { v4 as uuidv4 } from "uuid";
import db from "../db/knex";
import type { Conversation } from "../types";

export async function createConversation(): Promise<string> {
  const id = uuidv4();
  const createdAt = new Date().toISOString();

  await db("conversations").insert({
    id,
    created_at: createdAt,
  });

  return id;
}

export async function findConversationById(id: string): Promise<Conversation | undefined> {
  return db<Conversation>("conversations").where({ id }).first();
}
