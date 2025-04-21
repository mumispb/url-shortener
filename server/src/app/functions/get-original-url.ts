import { db, pg } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { z } from "zod";
import { eq } from "drizzle-orm";

const getOriginalUrlInput = z.object({
  slug: z.string(),
});

type GetOriginalUrlInput = z.input<typeof getOriginalUrlInput>;

export async function getOriginalUrl(
  input: GetOriginalUrlInput
): Promise<{ originalUrl: string }> {
  const { slug } = getOriginalUrlInput.parse(input);

  const shortenedUrl = `https://brev.ly/${slug}`;

  const [row] = await db
    .select({ originalUrl: schema.shortens.originalUrl })
    .from(schema.shortens)
    .where(eq(schema.shortens.shortenedUrl, shortenedUrl));

  if (!row) {
    throw new Error("Shortened URL not found");
  }

  await pg.unsafe(
    "UPDATE shortens SET visits = visits + 1 WHERE shortened_url = $1",
    [shortenedUrl]
  );

  return { originalUrl: row.originalUrl };
}
