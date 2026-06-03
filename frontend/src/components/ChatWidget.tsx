import { useEffect, useRef, useState } from "react";
import { fetchHistory, getErrorMessage, sendMessage } from "../lib/api";
import type { Message } from "../types";
import ChatComposer from "./chat/ChatComposer";
import ChatHeader from "./chat/ChatHeader";
import MessageList from "./chat/MessageList";

const SESSION_STORAGE_KEY = "shopspur_session_id";

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);

    if (!storedSessionId) {
      return;
    }

    fetchHistory(storedSessionId)
      .then((history) => {
        setMessages(
          history.map((message) => ({
            sender: message.sender,
            text: message.text,
          })),
        );
        setSessionId(storedSessionId);
      })
      .catch(() => {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const trimmedInput = inputValue.trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { sender: "user", text: trimmedInput },
    ]);
    setInputValue("");
    setIsLoading(true);

    try {
      const result = await sendMessage(trimmedInput, sessionId ?? undefined);

      setSessionId(result.sessionId);
      localStorage.setItem(SESSION_STORAGE_KEY, result.sessionId);
      setMessages((currentMessages) => [
        ...currentMessages.slice(0, -1),
        { sender: "user", text: result.message },
        ...(result.warning
          ? [{ sender: "ai" as const, text: result.warning, isError: true }]
          : []),
        { sender: "ai", text: result.reply },
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          sender: "ai",
          text: getErrorMessage(error),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-6 text-zinc-100">
      <section className="flex h-[min(780px,calc(100vh-3rem))] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-xl shadow-black/30">
        <ChatHeader />
        <MessageList bottomRef={bottomRef} isLoading={isLoading} messages={messages} />
        <ChatComposer
          inputValue={inputValue}
          isLoading={isLoading}
          onInputChange={setInputValue}
          onSend={() => void handleSend()}
        />
      </section>
    </main>
  );
}
