import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { z } from "zod";
import { eq } from "drizzle-orm";

const deleteShortensInput = z.object({
  slug: z.string(),
});

type DeleteShortensInput = z.input<typeof deleteShortensInput>;

export async function deleteShortens(
  input: DeleteShortensInput
): Promise<void> {
  const { slug } = deleteShortensInput.parse(input);

  const shortenedUrl = `https://brev.ly/${slug}`;

  const [existing] = await db
    .select({ id: schema.shortens.id })
    .from(schema.shortens)
    .where(eq(schema.shortens.shortenedUrl, shortenedUrl));

  if (!existing) {
    throw new Error("Shortened URL not found");
  }

  await db
    .delete(schema.shortens)
    .where(eq(schema.shortens.shortenedUrl, shortenedUrl));
}
