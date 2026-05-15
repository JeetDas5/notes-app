import db from "@/db";
import { noteTags, tags } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function attachTagsToNote(noteId: string, tagNames: string[]) {
  const normalized = Array.from(
    new Set(
      (tagNames || [])
        .map((t) => t?.trim().toLowerCase())
        .filter(Boolean),
    ),
  );

  for (const name of normalized) {
    let tag = await db.query.tags.findFirst({ where: eq(tags.name, name) });

    if (!tag) {
      try {
        const [newTag] = await db.insert(tags).values({ name }).returning();
        tag = newTag;
      } catch (err) {
        // possible unique constraint race — re-query
        tag = await db.query.tags.findFirst({ where: eq(tags.name, name) });
        if (!tag) throw err;
      }
    }

    const existing = await db.query.noteTags.findFirst({
      where: and(eq(noteTags.noteId, noteId), eq(noteTags.tagId, tag.id)),
    });

    if (!existing) {
      await db.insert(noteTags).values({ noteId, tagId: tag.id });
    }
  }
}
