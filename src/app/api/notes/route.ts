import db from "@/db";
import { notes } from "@/db/schema";
import { attachTagsToNote } from "@/helpers/tag-helper";
import { getCurrentUser } from "@/lib/user";
import { createNoteSchema } from "@/validations/notes.validator";
import { and, desc, eq, ilike } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);

    const tag = searchParams.get("tag");
    const query = searchParams.get("query") || "";

    const archived = searchParams.get("archived") === "true";

    const allNotes = await db.query.notes.findMany({
      where: and(
        eq(notes.userId, user.userId),
        eq(notes.isArchived, archived),
        query ? ilike(notes.title, `%${query}%`) : undefined,
      ),
      orderBy: [desc(notes.updatedAt)],
      with: {
        noteTags: {
          with: {
            tag: true,
          },
        },
      },
    });

    let resultNotes = allNotes;
    if (tag) {
      const normalizedTag = tag.trim().toLowerCase();
      resultNotes = allNotes.filter((n) =>
        n.noteTags?.some((nt) => nt.tag?.name === normalizedTag),
      );
    }

    return NextResponse.json(
      { message: "Notes fetched successfully", data: resultNotes },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    const validatedData = createNoteSchema.parse(body);

    if (!validatedData.title && !validatedData.content) {
      return NextResponse.json(
        { error: "Title or content is required" },
        { status: 400 },
      );
    }

    const [newNote] = await db
      .insert(notes)
      .values({
        title: validatedData.title || "Untitled",
        content: validatedData.content || "",
        userId: user.userId,
      })
      .returning();

    if (validatedData.tags?.length) {
      await attachTagsToNote(newNote.id, validatedData.tags);
    }
    return NextResponse.json(
      { message: "Note created successfully", data: newNote },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error creating note:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message || "Invalid note data" },
        { status: 400 },
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
