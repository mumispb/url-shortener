import { exportShortens } from "@/app/functions/export-shortens";
import { unwrapEither } from "@/infra/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const exportShortensRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/shortens/exports",
    {
      schema: {
        summary: "Export shortens",
        tags: ["shortens"],
        querystring: z.object({ searchQuery: z.string().optional() }),
        response: {
          200: z.object({ reportUrl: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { searchQuery } = request.query;

      const result = await exportShortens({ searchQuery });

      const { reportUrl } = unwrapEither(result);

      return reply.status(200).send({ reportUrl });
    }
  );
};
