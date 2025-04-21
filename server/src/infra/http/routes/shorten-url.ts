import { shortenUrl } from "@/app/functions/shorten-url";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const shortenUrlRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/shortens",
    {
      schema: {
        summary: "Creates a shortened URL",
        tags: ["shortens"],
        consumes: ["application/json"],
        body: z.object({ originalUrl: z.string().url(), slug: z.string() }),
        response: {
          201: z
            .object({ shortenedUrl: z.string() })
            .describe("Shortened URL created"),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { shortenedUrl } = await shortenUrl({
        originalUrl: request.body.originalUrl,
        slug: request.body.slug,
      });

      return reply.status(201).send({ shortenedUrl });
    }
  );
};
