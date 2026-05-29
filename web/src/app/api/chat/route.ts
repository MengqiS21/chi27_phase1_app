import { NextResponse } from "next/server";
import { getAiResponse } from "@/lib/anthropic";
import { getSupabase } from "@/lib/supabase";
import type { ChatMessage } from "@/lib/types";

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
      condition: string;
      scenarioType: string;
      scenarioIndex: number;
      turnCount: number;
      userContent: string;
    };

    const pending: ChatMessage[] = [
      ...messages,
      { role: "user", content: userContent },
    ];

    const assistantText = await getAiResponse(pending, condition, turnCount);

    if (!assistantText) {
      return NextResponse.json(
        { error: "The AI returned an empty response." },
        { status: 502 }
      );
    }

    const supabase = getSupabase();
    const rows = [
      {
        participant_id: participantId,
        scenario_index: scenarioIndex,
        scenario_type: scenarioType,
        condition,
        turn_index: turnCount,
        role: "user",
        content: userContent,
      },
      {
        participant_id: participantId,
        scenario_index: scenarioIndex,
        scenario_type: scenarioType,
        condition,
        turn_index: turnCount,
        role: "assistant",
        content: assistantText,
      },
    ];

    const { error: dbError } = await supabase.from("conversations").insert(rows);
    if (dbError) {
      console.error("Failed to save messages:", dbError.message);
    }

    return NextResponse.json({
      assistantText,
      refusalDelivered: turnCount >= 3,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not get a response from the AI. ${message}` },
      { status: 500 }
    );
  }
}
