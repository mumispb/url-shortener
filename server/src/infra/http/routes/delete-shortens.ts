import { deleteShortens } from "@/app/functions/delete-shortens";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const deleteShortensRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/shortens",
    {
      schema: {
        summary: "Delete a shortened URL",
        tags: ["shortens"],
        querystring: z.object({ id: z.string() }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        await deleteShortens({ id: request.query.id });
        return reply.status(204).send();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        return reply.status(404).send({ message });
      }
    }
  );
};
