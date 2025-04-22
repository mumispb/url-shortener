import { db, pg } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { Either, makeLeft, makeRight } from "@/infra/shared/either";

const getOriginalUrlInput = z.object({
  slug: z.string(),
});

type GetOriginalUrlInput = z.input<typeof getOriginalUrlInput>;

export async function getOriginalUrl(
  input: GetOriginalUrlInput
): Promise<Either<Error, { originalUrl: string }>> {
  const { slug } = getOriginalUrlInput.parse(input);

  const [row] = await db
    .select({ originalUrl: schema.shortens.originalUrl })
    .from(schema.shortens)
    .where(eq(schema.shortens.slug, slug));

  if (!row) {
    return makeLeft(new Error("Shortened URL not found"));
  }

  await pg.unsafe("UPDATE shortens SET visits = visits + 1 WHERE slug = $1", [
    slug,
  ]);

  return makeRight({ originalUrl: row.originalUrl });
}
