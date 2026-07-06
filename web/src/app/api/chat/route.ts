import { NextResponse } from "next/server";
import { getAiResponse } from "@/lib/anthropic";
import { saveConversationTurn } from "@/lib/conversation-store";
import type { ChatMessage, Condition } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      participantId,
      messages,
      condition,
      scenarioType,
      scenarioIndex,
      turnCount,
      userContent,
    } = body as {
      participantId: string;
      messages: ChatMessage[];
      condition: Condition;
      scenarioType: string;
      scenarioIndex: number;
      turnCount: number;
      userContent: string;
    };

    const pending: ChatMessage[] = [
      ...messages,
      { role: "user", content: userContent },
    ];

    const assistantText = await getAiResponse(pending, {
      condition,
      turnCount,
    });

    if (!assistantText) {
      return NextResponse.json(
        { error: "The AI returned an empty response." },
        { status: 502 }
      );
    }

    const dbError = await saveConversationTurn({
      participantId,
      scenarioIndex,
      scenarioType,
      condition,
      turnCount,
      userContent,
      assistantText,
    });
    if (dbError) {
      console.error("Failed to save conversation:", dbError);
    }

    return NextResponse.json({
      assistantText,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not get a response from the AI. ${message}` },
      { status: 500 }
    );
  }
}
