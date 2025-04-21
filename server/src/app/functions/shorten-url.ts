import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { z } from "zod";
import { generateShortenedUrl } from "../utils/generate-shortened-url";

const shortenUrlInput = z.object({
  originalUrl: z.string().url(),
  slug: z.string().optional(),
});

type ShortenUrlInput = z.input<typeof shortenUrlInput>;

export async function shortenUrl(
  input: ShortenUrlInput
): Promise<{ shortenedUrl: string }> {
  const { originalUrl, slug } = shortenUrlInput.parse(input);

  const shortenedUrl = slug
    ? `https://brev.ly/${slug}`
    : generateShortenedUrl(originalUrl);

  await db.insert(schema.shortens).values({
    originalUrl,
    shortenedUrl,
  });

  return { shortenedUrl };
}
