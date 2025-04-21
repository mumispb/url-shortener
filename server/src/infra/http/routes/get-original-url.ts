import { getOriginalUrl } from "@/app/functions/get-original-url";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getOriginalUrlRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/shortens/:shortenedUrl",
    {
      schema: {
        summary: "Get original URL by shortened URL",
        tags: ["shortens"],
        params: z.object({ shortenedUrl: z.string() }),
        response: {
          200: z.object({ originalUrl: z.string().url() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { originalUrl } = await getOriginalUrl({
          shortenedUrl: request.params.shortenedUrl,
        });
        return reply.status(200).send({ originalUrl });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        return reply.status(404).send({ message });
      }
    }
  );
};
