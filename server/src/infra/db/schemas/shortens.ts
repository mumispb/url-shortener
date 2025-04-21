import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const shortens = pgTable("shortens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  originalUrl: text("original_url").notNull(),
  shortenedUrl: text("shortened_url").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
