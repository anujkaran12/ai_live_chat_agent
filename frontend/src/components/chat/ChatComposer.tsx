import type { KeyboardEvent } from "react";

interface ChatComposerProps {
  inputValue: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatComposer({
  inputValue,
  isLoading,
  onInputChange,
  onSend,
}: ChatComposerProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 p-4">
      <div className="flex gap-3">
        <textarea
          className="min-h-12 flex-1 resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm leading-5 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-600"
          disabled={isLoading}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={2}
          value={inputValue}
        />
        <button
          className="h-12 shrink-0 rounded-lg bg-zinc-100 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
          disabled={isLoading || !inputValue.trim()}
          onClick={onSend}
          type="button"
        >
          Send
        </button>
      </div>
    </div>
  );
}
