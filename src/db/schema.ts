import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name").notNull(),

  email: varchar("email").unique().notNull(),

  password: varchar("password").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notes = pgTable("notes", {
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

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name").notNull(),
});

export const noteTags = pgTable("note_tags", {
  noteId: uuid("note_id").notNull(),

  tagId: uuid("tag_id").notNull(),
});
