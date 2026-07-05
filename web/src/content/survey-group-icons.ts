import {
  ArrowRight,
  BookOpen,
  Bot,
  Compass,
  Forward,
  Heart,
  Lightbulb,
  MessageSquare,
  MessagesSquare,
  Users,
  type LucideIcon,
} from "lucide-react";

export const SURVEY_GROUP_ICONS = {
  "book-open": BookOpen,
  heart: Heart,
  lightbulb: Lightbulb,
  compass: Compass,
  "messages-square": MessagesSquare,
  forward: Forward,
  bot: Bot,
  users: Users,
  "message-square": MessageSquare,
  "arrow-right": ArrowRight,
} as const satisfies Record<string, LucideIcon>;

export type SurveyGroupIconKey = keyof typeof SURVEY_GROUP_ICONS;
