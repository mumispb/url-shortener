import { getOriginalUrl } from "@/app/functions/get-original-url";
import { isLeft, unwrapEither } from "@/infra/shared/either";
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
      const result = await getOriginalUrl({
        slug: request.params.slug,
      });

      if (isLeft(result)) {
        return reply.status(404).send({ message: result.left.message });
      }

      const { originalUrl } = unwrapEither(result);

      return reply.status(200).send({ originalUrl });
    }
  );
};
