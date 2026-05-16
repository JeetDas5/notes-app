import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  boolean,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name").notNull(),

    email: varchar("email").unique().notNull(),

    password: varchar("password").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("name_idx").on(table.name),
    uniqueIndex("email_idx").on(table.email),
  ],
);

export const notes = pgTable(
  "notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    title: varchar("title").default("Untitled"),

    content: text("content").default(""),

    isArchived: boolean("is_archived").default(false),

    isPublic: boolean("is_public").default(false),

    shareId: uuid("share_id").defaultRandom(),

    aiSummary: text("ai_summary"),

    aiSuggestedTitle: varchar("ai_suggested_title"),

    actionItems: text("action_items"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("title_idx").on(table.title),
    index("user_id_idx").on(table.userId),
    index("share_id_idx").on(table.shareId),
  ],
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name").notNull(),
  },
  (table) => [uniqueIndex("tags_name_idx").on(table.name)],
);

export const noteTags = pgTable(
  "note_tags",
  {
    noteId: uuid("note_id")
      .references(() => notes.id, {
        onDelete: "cascade",
      })
      .notNull(),
    tagId: uuid("tag_id")
      .references(() => tags.id, {
        onDelete: "cascade",
      })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.noteId, table.tagId],
    }),
  }),
);

export const ai_generations = pgTable("ai_generations", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  noteId: uuid("note_id")
    .references(() => notes.id, {
      onDelete: "cascade",
    })
    .notNull(),

  type: varchar("type", { length: 50 }).notNull(),

  prompt: text("prompt").notNull(),

  response: text("response").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notesRelations = relations(notes, ({ many }) => ({
  noteTags: many(noteTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  noteTags: many(noteTags),
}));

export const noteTagsRelations = relations(noteTags, ({ one }) => ({
  note: one(notes, {
    fields: [noteTags.noteId],
    references: [notes.id],
  }),

  tag: one(tags, {
    fields: [noteTags.tagId],
    references: [tags.id],
  }),
}));
