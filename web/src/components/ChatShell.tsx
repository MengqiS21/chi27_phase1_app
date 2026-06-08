"use client";

import { useState } from "react";
import { Bot, ChevronDown } from "lucide-react";
import { ChatComposer } from "@/components/ChatComposer";
import { ChatPanel } from "@/components/ChatPanel";
import { CHAT_SITUATION_TOGGLE_LABEL } from "@/content/scenarios";
import type { ChatMessage } from "@/lib/types";

type Props = {
  scenarioTitle: string;
  scenarioText: string;
  taskInstructions: string;
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  refusalDelivered: boolean;
  onContinue: () => void;
  continueLabel?: string;
};

export function ChatShell({
  scenarioTitle,
  scenarioText,
  taskInstructions,
  messages,
  input,
  onInputChange,
  onSend,
  isLoading,
  refusalDelivered,
  onContinue,
  continueLabel = "Continue to questions",
}: Props) {
  const [contextOpen, setContextOpen] = useState(false);

  return (
    <div className="chat-shell">
      <header className="chat-shell-header">
        <div className="chat-shell-brand">
          <span className="chat-shell-avatar" aria-hidden>
            <Bot size={18} strokeWidth={2} />
          </span>
          <div>
            <p className="chat-shell-title">Assistant</p>
            <p className="chat-shell-subtitle">Emotional support chat</p>
          </div>
        </div>
        <button
          type="button"
          className={`chat-context-toggle ${contextOpen ? "chat-context-toggle-open" : ""}`}
          onClick={() => setContextOpen((open) => !open)}
          aria-expanded={contextOpen}
        >
          {CHAT_SITUATION_TOGGLE_LABEL}
          <ChevronDown size={16} strokeWidth={2} aria-hidden />
        </button>
      </header>

      <div
        className={`chat-context-panel ${contextOpen ? "chat-context-panel-open" : ""}`}
        hidden={!contextOpen}
      >
        <p className="chat-context-label">{scenarioTitle}</p>
        <p className="chat-context-text">{scenarioText}</p>
      </div>

      <div className="chat-task-banner">
        <p className="chat-task-banner-text">{taskInstructions}</p>
      </div>

      <div className="chat-shell-body">
        <ChatPanel messages={messages} isTyping={isLoading} />
      </div>

      <footer className="chat-shell-footer">
        {refusalDelivered ? (
          <div className="chat-shell-continue">
            <p className="chat-shell-continue-text">
              The conversation has ended. When you are ready, continue to the
              follow-up questions.
            </p>
            <button
              type="button"
              className="btn-primary w-full sm:w-auto"
              onClick={onContinue}
            >
              {continueLabel}
            </button>
          </div>
        ) : (
          <ChatComposer
            value={input}
            onChange={onInputChange}
            onSubmit={onSend}
            loading={isLoading}
          />
        )}
      </footer>
    </div>
  );
}
