import { Bot, UserRound } from "lucide-react";

type Props = {
  role: "user" | "assistant";
};

export function ChatAvatar({ role }: Props) {
  const isUser = role === "user";
  const Icon = isUser ? UserRound : Bot;
  const label = isUser ? "You" : "AI";

  return (
    <div
      className={`chat-avatar ${isUser ? "chat-avatar-user" : "chat-avatar-ai"}`}
      aria-hidden
      title={label}
    >
      <Icon size={18} strokeWidth={2} />
    </div>
  );
}
