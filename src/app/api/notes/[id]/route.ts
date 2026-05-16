import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import db from "@/db";
import { notes } from "@/db/schema";
import { getCurrentUser } from "@/lib/user";

import { updateNoteSchema } from "@/validations";
import { ZodError } from "zod";

type Params = Promise<{
  id: string;
}>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const note = await db.query.notes.findFirst({
      where: and(eq(notes.id, id), eq(notes.userId, user.userId)),
    });

    if (!note) {
      return NextResponse.json(
        {
          message: "Note not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      message: "Note fetched",
      data: note,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch note",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await req.json();

    const validatedData = updateNoteSchema.parse(body);

    const [updatedNote] = await db
      .update(notes)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(and(eq(notes.id, id), eq(notes.userId, user.userId)))
      .returning();

    if (!updatedNote) {
      return NextResponse.json(
        {
          message: "Note not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      message: "Note updated",
      data: updatedNote,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          error: error.issues[0].message,
        },
        { status: 400 },
      );
    }
    if (error instanceof Error) {
      console.error("Error updating note:", error.message);
      return NextResponse.json(
        {
          message: error.message || "Failed to update note",
        },
        {
          status: 500,
        },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [deletedNote] = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, user.userId)))
      .returning();

    if (!deletedNote) {
      return NextResponse.json(
        {
          message: "Note not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      message: "Note deleted",
      data: deletedNote,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Failed to delete note",
      },
      {
        status: 500,
      },
    );
  }
}
