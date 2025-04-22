import { PassThrough, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { db, pg } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { type Either, makeRight } from "@/infra/shared/either";
import { uploadFileToStorage } from "@/infra/storage/upload-file-to-storage";
import { stringify } from "csv-stringify";
import { ilike } from "drizzle-orm";
import { z } from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Configure dayjs to handle timezones
dayjs.extend(utc);
dayjs.extend(timezone);

const exportShortensInput = z.object({
  searchQuery: z.string().optional(),
});

type ExportShortensInput = z.input<typeof exportShortensInput>;

type ExportShortensOutput = {
  reportUrl: string;
};

export async function exportShortens(
  input: ExportShortensInput
): Promise<Either<never, ExportShortensOutput>> {
  const { searchQuery } = exportShortensInput.parse(input);

  const { sql, params } = db
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
    .toSQL();

  const cursor = pg.unsafe(sql, params as string[]).cursor(2);

  const csv = stringify({
    delimiter: ",",
    header: true,
    columns: [
      { key: "id", header: "ID" },
      { key: "original_url", header: "URL Original" },
      { key: "slug", header: "URL Encurtada" },
      { key: "visits", header: "Visitas" },
      { key: "created_at", header: "Criado em" },
    ],
  });

  const uploadToStorageStream = new PassThrough();

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: unknown[], encoding, callback) {
        for (const chunk of chunks) {
          if (
            typeof chunk === "object" &&
            chunk !== null &&
            "created_at" in chunk
          ) {
            const typedChunk = chunk as Record<string, unknown>;
            const createdAt = typedChunk.created_at as string;
            typedChunk.created_at = dayjs
              .utc(createdAt)
              .tz("America/Sao_Paulo")
              .format("DD/MM/YYYY HH:mm");
          }
          this.push(chunk);
        }
        callback();
      },
    }),
    csv,
    uploadToStorageStream
  );

  const uploadToStorage = uploadFileToStorage({
    contentType: "text/csv",
    folder: "downloads",
    fileName: `${new Date().toISOString()}-shortens.csv`,
    contentStream: uploadToStorageStream,
  });

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline]);

  return makeRight({ reportUrl: url });
}
