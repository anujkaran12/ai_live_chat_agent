import type { Message } from "../../types";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";
  const bubbleClasses = message.isError
    ? "border border-red-900/60 bg-red-950/30 text-red-200"
    : isUser
      ? "bg-zinc-100 text-zinc-950"
      : "border border-zinc-800 bg-zinc-900 text-zinc-100";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-6 ${bubbleClasses}`}
      >
        {message.text}
      </div>
    </div>
  );
}
