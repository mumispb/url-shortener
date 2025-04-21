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
        body: z.object({ originalUrl: z.string().url() }),
        response: {
          201: z
            .object({ shortenedUrl: z.string() })
            .describe("Shortened URL created"),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const result = await shortenUrl({
        originalUrl: request.body.originalUrl,
      });

      return { shortenedUrl: result.shortenedUrl };

      // if (isRight(result)) {
      //   console.log(unwrapEither(result));

      //   return reply.status(201).send(unwrapEither(result));
      // }

      // const error = unwrapEither(result);

      // switch (error.constructor.name) {
      //   case "InvalidFileFormat":
      //     return reply.status(400).send({ message: error.message });
      // }
    }
  );
};
