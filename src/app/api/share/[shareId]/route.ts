import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import db from "@/db";
import { notes } from "@/db/schema";

type Params = Promise<{
  shareId: string;
}>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { shareId } = await params;

    const note = await db.query.notes.findFirst({
      where: and(eq(notes.shareId, shareId), eq(notes.isPublic, true)),
    });

    if (!note) {
      return NextResponse.json(
        {
          message: "Shared note not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      message: "Shared note fetched successfully",
      data: note,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch shared note",
      },
      {
        status: 500,
      },
    );
  }
}
