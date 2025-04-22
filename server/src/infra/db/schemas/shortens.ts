import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const shortens = pgTable("shortens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  originalUrl: text("original_url").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  visits: integer("visits").notNull().default(0),
});
