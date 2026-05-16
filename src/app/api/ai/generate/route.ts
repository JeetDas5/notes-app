import db from "@/db";
import { ai_generations, notes } from "@/db/schema";
import { buildPrompt } from "@/lib/prompt";
import { getCurrentUser } from "@/lib/user";
import { openai } from "@/lib/ai";

import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { noteId } = body;

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 },
      );
    }

    const note = await db.query.notes.findFirst({
      where: and(eq(notes.id, noteId), eq(notes.userId, user.userId)),
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const prompt = buildPrompt(note.content || "");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a structured JSON assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.3,

      max_completion_tokens: 500,

      response_format: {
        type: "json_object",
      },
    });

    const aiResponse = completion.choices[0].message?.content;

    const parsed: ParsedAIResponse =
      typeof aiResponse === "string" ? JSON.parse(aiResponse) : aiResponse;

    await db.insert(ai_generations).values({
      noteId: note.id,
      userId: user.userId,
      type: "summary",
      prompt,
      response: JSON.stringify(parsed),
    });

    await db
      .update(notes)
      .set({
        aiSummary: parsed.summary,
        aiSuggestedTitle: parsed.suggested_title,
        actionItems: JSON.stringify(parsed.action_items),
      })
      .where(eq(notes.id, note.id));

    return NextResponse.json({
      message: "AI generation completed",
      data: parsed,
    });
  } catch (error) {
    console.error("Error in AI generation:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
