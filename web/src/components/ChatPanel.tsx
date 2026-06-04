"use client";

import { useEffect, useRef } from "react";
import { ChatAvatar } from "@/components/ChatAvatar";
import type { ChatMessage } from "@/lib/types";

type Props = {
  messages: ChatMessage[];
  isTyping?: boolean;
};

function TypingIndicator() {
  return (
    <div className="chat-message chat-message-assistant" aria-label="Assistant is typing">
      <ChatAvatar role="assistant" />
      <div className="chat-message-body">
        <div className="chat-bubble-assistant chat-typing-bubble">
          <span className="chat-typing-dot" />
          <span className="chat-typing-dot" />
          <span className="chat-typing-dot" />
        </div>
      </div>
    </div>
  );
}

export function ChatPanel({ messages, isTyping = false }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  return (
    <div className="chat-thread" aria-live="polite">
      {messages.length === 0 && !isTyping ? (
        <div className="chat-empty">
          <p className="chat-empty-title">Start the conversation</p>
          <p className="chat-empty-text">
            Share what you might say in this situation, as if you were talking
            to a support assistant.
          </p>
        </div>
      ) : null}

      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        const showAssistantLabel =
          !isUser &&
          (i === 0 || messages[i - 1]?.role !== "assistant");

        return (
          <div
            key={`${msg.role}-${i}-${msg.content.slice(0, 24)}`}
            className={`chat-message ${isUser ? "chat-message-user" : "chat-message-assistant"}`}
          >
            {!isUser ? <ChatAvatar role="assistant" /> : null}
            <div className="chat-message-body">
              {showAssistantLabel ? (
                <span className="chat-role">Assistant</span>
              ) : null}
              <div
                className={isUser ? "chat-bubble-user" : "chat-bubble-assistant"}
              >
                {msg.content}
              </div>
            </div>
            {isUser ? <ChatAvatar role="user" /> : null}
          </div>
        );
      })}

      {isTyping ? <TypingIndicator /> : null}
      <div ref={endRef} className="chat-thread-anchor" aria-hidden />
    </div>
  );
}
