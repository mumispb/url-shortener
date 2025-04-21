import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { z } from "zod";
import { generateShortenedUrl } from "../utils/generate-shortened-url";

const shortenUrlInput = z.object({
  originalUrl: z.string().url(),
});

type ShortenUrlInput = z.input<typeof shortenUrlInput>;

export async function shortenUrl(
  input: ShortenUrlInput
): Promise<{ shortenedUrl: string }> {
  const { originalUrl } = shortenUrlInput.parse(input);

  const shortenedUrl = generateShortenedUrl(originalUrl);

  await db.insert(schema.shortens).values({
    originalUrl,
    shortenedUrl,
  });

  return { shortenedUrl };
}
