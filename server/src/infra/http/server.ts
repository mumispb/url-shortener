import { shortenUrlRoute } from "@/infra/http/routes/shorten-url";
import { getOriginalUrlRoute } from "@/infra/http/routes/get-original-url";
import { deleteShortensRoute } from "@/infra/http/routes/delete-shortens";
import { getShortensRoute } from "@/infra/http/routes/get-shortens";
import { transformSwaggerSchema } from "@/infra/http/transform-swagger-schema";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { exportShortensRoute } from "@/infra/http/routes/export-shortens";

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: "Validation error",
      issues: error.validation,
    });
  }

  console.error(error);

  return reply.status(500).send({ message: "Internal server error." });
});

server.register(fastifyCors, { origin: "*" });

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "URL Shortener",
      version: "1.0.0",
    },
  },
  transform: transformSwaggerSchema,
});

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

server.register(shortenUrlRoute);
server.register(getOriginalUrlRoute);
server.register(deleteShortensRoute);
server.register(getShortensRoute);
server.register(exportShortensRoute);

server.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP Server running!");
});
