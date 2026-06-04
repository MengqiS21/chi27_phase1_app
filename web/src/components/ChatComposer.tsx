"use client";

import { ArrowUp } from "lucide-react";
import { FormEvent, KeyboardEvent } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
};

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  disabled = false,
  loading = false,
  placeholder = "Message the assistant…",
}: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled || loading) return;
    onSubmit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!value.trim() || disabled || loading) return;
      onSubmit();
    }
  };

  return (
    <form className="chat-composer" onSubmit={handleSubmit}>
      <div className="chat-composer-inner">
        <textarea
          id="chat-input"
          className="chat-composer-input"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || loading}
          aria-label="Message the assistant"
        />
        <button
          type="submit"
          className="chat-composer-send"
          disabled={disabled || loading || !value.trim()}
          aria-label={loading ? "Assistant is typing" : "Send message"}
        >
          <ArrowUp size={18} strokeWidth={2.5} aria-hidden />
        </button>
      </div>
      <p className="chat-composer-hint">Enter to send · Shift+Enter for a new line</p>
    </form>
  );
}
