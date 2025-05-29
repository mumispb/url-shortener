import { shortenUrl } from "@/app/functions/shorten-url";
import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

describe("shorten url", () => {
  it("should be able to create a shortened url", async () => {
    const originalUrl = `https://www.${nanoid()}.com`;

    const sut = await shortenUrl({
      originalUrl,
    });

    // expect(isRight(sut)).toBe(true);
    expect(sut.shortenedUrl).toBeDefined();

    const result = await db
      .select()
      .from(schema.shortens)
      .where(eq(schema.shortens.originalUrl, originalUrl));

    expect(result).toHaveLength(1);
  });

  it("should not be able to create a shortened url with an invalid url", async () => {
    const originalUrl = "invalid-url-%$*!@";

    await expect(shortenUrl({ originalUrl })).rejects.toBeInstanceOf(ZodError);
  });
});
