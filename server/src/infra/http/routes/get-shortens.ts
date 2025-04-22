import { getShortens } from "@/app/functions/get-shortens";
import { unwrapEither } from "@/infra/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getShortensRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/shortens",
    {
      schema: {
        summary: "Get shortens",
        tags: ["shortens"],
        querystring: z.object({
          searchQuery: z.string().optional(),
          sortBy: z.enum(["createdAt"]).optional(),
          sortDirection: z.enum(["asc", "desc"]).optional(),
          page: z.coerce.number().optional().default(1),
          pageSize: z.coerce.number().optional().default(20),
        }),
        response: {
          200: z.object({
            shortens: z.array(
              z.object({
                id: z.string(),
                originalUrl: z.string().url(),
                slug: z.string(),
                visits: z.number(),
                createdAt: z.date(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { page, pageSize, searchQuery, sortBy, sortDirection } =
        request.query;

      const result = await getShortens({
        page,
        pageSize,
        searchQuery,
        sortBy,
        sortDirection,
      });

      const { shortens, total } = unwrapEither(result);

      return reply.status(200).send({ shortens, total });
    }
  );
};
