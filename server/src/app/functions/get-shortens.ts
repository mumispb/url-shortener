import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeRight } from "@/infra/shared/either";
import { asc, count, desc, ilike } from "drizzle-orm";
import { z } from "zod";

const getShortensInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(["createdAt"]).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
});

type GetShortensInput = z.input<typeof getShortensInput>;

type GetShortensOutput = {
  shortens: {
    id: string;
    originalUrl: string;
    slug: string;
    visits: number;
    createdAt: Date;
  }[];
  total: number;
};

export async function getShortens(
  input: GetShortensInput
): Promise<Either<never, GetShortensOutput>> {
  const { page, pageSize, searchQuery, sortBy, sortDirection } =
    getShortensInput.parse(input);

  const [shortens, [{ total }]] = await Promise.all([
    db
      .select({
        id: schema.shortens.id,
        originalUrl: schema.shortens.originalUrl,
        slug: schema.shortens.slug,
        visits: schema.shortens.visits,
        createdAt: schema.shortens.createdAt,
      })
      .from(schema.shortens)
      .where(
        searchQuery
          ? ilike(schema.shortens.originalUrl, `%${searchQuery}%`)
          : undefined
      )
      .orderBy((fields) => {
        if (sortBy && sortDirection === "asc") {
          return asc(fields[sortBy]);
        }

        if (sortBy && sortDirection === "desc") {
          return desc(fields[sortBy]);
        }

        return desc(fields.id);
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize),

    db
      .select({ total: count(schema.shortens.id) })
      .from(schema.shortens)
      .where(
        searchQuery
          ? ilike(schema.shortens.originalUrl, `%${searchQuery}%`)
          : undefined
      ),
  ]);

  return makeRight({ shortens, total });
}
