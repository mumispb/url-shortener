import { deleteShortens } from "@/app/functions/delete-shortens";
import { isLeft } from "@/infra/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const deleteShortensRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/shortens",
    {
      schema: {
        summary: "Delete a shortened URL",
        tags: ["shortens"],
        querystring: z.object({ slug: z.string() }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const result = await deleteShortens({ slug: request.query.slug });

      if (isLeft(result)) {
        return reply.status(404).send({ message: result.left.message });
      }

      return reply.status(204).send();
    }
  );
};
