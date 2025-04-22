import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeRight } from "@/infra/shared/either";
import { z } from "zod";

const shortenUrlInput = z.object({
  originalUrl: z.string().url(),
  slug: z.string().regex(/^[a-z0-9]+$/),
});

type ShortenUrlInput = z.input<typeof shortenUrlInput>;

export async function shortenUrl(
  input: ShortenUrlInput
): Promise<Either<never, { slug: string }>> {
  const { originalUrl, slug } = shortenUrlInput.parse(input);

  await db.insert(schema.shortens).values({
    originalUrl,
    slug,
  });

  return makeRight({ slug });
}
