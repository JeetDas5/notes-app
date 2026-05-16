import db from "@/db";
import { notes } from "@/db/schema";
import { getCurrentUser } from "@/lib/user";

import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{
  id: string;
}>;

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await params;

    const existingNote = await db.query.notes.findFirst({
      where: and(eq(notes.id, id), eq(notes.userId, user.userId)),
    });

    if (!existingNote) {
      return NextResponse.json(
        {
          message: "Note not found",
        },
        {
          status: 404,
        },
      );
    }

    const [updatedNote] = await db
      .update(notes)
      .set({
        isPublic: !existingNote.isPublic,
      })
      .where(eq(notes.id, id))
      .returning();

    return NextResponse.json({
      message: "Share status updated",
      note: updatedNote,
      shareUrl: `/share/${updatedNote.shareId}`,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Failed to update sharing",
      },
      {
        status: 500,
      },
    );
  }
}
