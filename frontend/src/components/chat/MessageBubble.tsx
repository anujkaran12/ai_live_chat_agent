import { Bot, User } from "lucide-react";
import type { Message } from "../../types";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";
  const Icon = isUser ? User : Bot;
  const bubbleClasses = message.isError
    ? "border border-red-900/60 bg-red-950/30 text-red-200"
    : isUser
      ? "bg-zinc-100 text-zinc-950"
      : "border border-zinc-800 bg-zinc-900 text-zinc-100";
  const iconClasses = message.isError
    ? "border-red-900/60 bg-red-950/30 text-red-200"
    : isUser
      ? "bg-zinc-100 text-zinc-950"
      : "border border-zinc-800 bg-zinc-900 text-zinc-100";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[86%] items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconClasses}`}
          aria-hidden="true"
        >
          <Icon size={16} strokeWidth={2.2} />
        </div>
        <div
          className={`max-w-full whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-6 ${bubbleClasses}`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}
