import db from "@/db";
import { notes, notesCollborator } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";

// GET /api/notes/shared — notes shared WITH the current user (as collaborator)
export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all collaboration records for the user
    const collaborations = await db.query.notesCollborator.findMany({
      where: eq(notesCollborator.userId, currentUser.userId),
      with: {
        note: {
          with: {
            noteTags: {
              with: {
                tag: true,
              },
            },
          },
        },
      },
    });

    // Filter out null notes and build enriched result
    const sharedNotes = collaborations
      .filter((c) => c.note !== null)
      .map((c) => ({
        ...c.note,
        collaboratorRole: c.role,
        isShared: true,
      }));

    return NextResponse.json({
      message: "Shared notes fetched successfully",
      data: sharedNotes,
    });
  } catch (error) {
    console.error("Error fetching shared notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared notes" },
      { status: 500 }
    );
  }
}
