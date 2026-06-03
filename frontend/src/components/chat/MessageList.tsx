import type { RefObject } from "react";
import type { Message } from "../../types";
import EmptyChatState from "./EmptyChatState";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  bottomRef: RefObject<HTMLDivElement | null>;
}

export default function MessageList({ messages, isLoading, bottomRef }: MessageListProps) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto bg-zinc-950 px-5 py-5">
      {messages.length === 0 ? (
        <EmptyChatState />
      ) : (
        messages.map((message, index) => (
          <MessageBubble key={`${message.sender}-${index}`} message={message} />
        ))
      )}

      {isLoading ? <div className="text-sm text-zinc-500">Agent is typing...</div> : null}
      <div ref={bottomRef} />
    </div>
  );
}
