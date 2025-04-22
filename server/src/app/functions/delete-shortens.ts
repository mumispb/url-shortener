import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { Either, makeLeft, makeRight } from "@/infra/shared/either";

const deleteShortensInput = z.object({
  slug: z.string(),
});

type DeleteShortensInput = z.input<typeof deleteShortensInput>;

export async function deleteShortens(
  input: DeleteShortensInput
): Promise<Either<Error, void>> {
  const { slug } = deleteShortensInput.parse(input);

  const [existing] = await db
    .select({ id: schema.shortens.id })
    .from(schema.shortens)
    .where(eq(schema.shortens.slug, slug));

  if (!existing) {
    return makeLeft(new Error("Shortened URL not found"));
  }

  await db.delete(schema.shortens).where(eq(schema.shortens.id, existing.id));

  return makeRight(undefined);
}
