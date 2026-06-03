import type { KeyboardEvent } from "react";

interface ChatComposerProps {
  inputValue: string;
  isLoading: boolean;
  maxLength: number;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatComposer({
  inputValue,
  isLoading,
  maxLength,
  onInputChange,
  onSend,
}: ChatComposerProps) {
  const charactersLeft = maxLength - inputValue.length;

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 p-4">
      <div className="flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <textarea
            className="h-12 max-h-32 min-h-12 w-full resize-y rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm leading-5 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-600"
            disabled={isLoading}
            maxLength={maxLength}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            value={inputValue}
          />
          <div className="mt-1 text-right text-xs text-zinc-500">
            {charactersLeft} characters left
          </div>
        </div>
        <button
          className="mb-5 h-12 shrink-0 rounded-lg bg-zinc-100 px-5 text-sm font-semibold leading-none text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
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
