import db from "@/db";
import { ai_generations } from "@/db/schema";
import { getCurrentUser } from "@/lib/user";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const generations = await db
      .select()
      .from(ai_generations)
      .where(
        and(
          eq(ai_generations.userId, user.userId),
          eq(ai_generations.type, "summary")
        )
      );

    return NextResponse.json({ count: generations.length });
  } catch (error) {
    console.error("Error fetching AI summaries count:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI summaries count" },
      { status: 500 }
    );
  }
}
