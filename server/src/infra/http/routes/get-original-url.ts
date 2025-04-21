import { getOriginalUrl } from "@/app/functions/get-original-url";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getOriginalUrlRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/shortens/:slug",
    {
      schema: {
        summary: "Get original URL by id",
        tags: ["shortens"],
        params: z.object({ slug: z.string() }),
        response: {
          200: z.object({ originalUrl: z.string().url() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { originalUrl } = await getOriginalUrl({
          slug: request.params.slug,
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
