// Remove Collaborator

import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { notes, notesCollborator } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/user";

type Params = Promise<{ id: string; userId: string }>;

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: noteId, userId } = await params;

    // Only owner can remove collaborators (or collaborator removes themselves)
    const note = await db.query.notes.findFirst({
      where: eq(notes.id, noteId),
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const isOwner = note.userId === currentUser.userId;
    const isRemovingSelf = userId === currentUser.userId;

    if (!isOwner && !isRemovingSelf) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db
      .delete(notesCollborator)
      .where(
        and(
          eq(notesCollborator.noteId, noteId),
          eq(notesCollborator.userId, userId)
        )
      );

    return NextResponse.json({
      success: true,
      message: "Collaborator removed successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to remove collaborator" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
