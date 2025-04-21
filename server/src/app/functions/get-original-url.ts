import { db, pg } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { z } from "zod";
import { eq } from "drizzle-orm";

const getOriginalUrlInput = z.object({
  id: z.string(),
});

type GetOriginalUrlInput = z.input<typeof getOriginalUrlInput>;

export async function getOriginalUrl(
  input: GetOriginalUrlInput
): Promise<{ originalUrl: string }> {
  const { id } = getOriginalUrlInput.parse(input);

  const [row] = await db
    .select({ originalUrl: schema.shortens.originalUrl })
    .from(schema.shortens)
    .where(eq(schema.shortens.id, id));

  if (!row) {
    throw new Error("Shortened URL not found");
  }

  await pg.unsafe("UPDATE shortens SET visits = visits + 1 WHERE id = $1", [
    id,
  ]);

  return { originalUrl: row.originalUrl };
}
