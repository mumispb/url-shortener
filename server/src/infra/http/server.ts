import { exportUploadsRoute } from "@/infra/http/routes/export-uploads";
import { getUploadsRoute } from "@/infra/http/routes/get-uploads";
import {
  shortenUrlRoute,
  uploadImageRoute,
} from "@/infra/http/routes/shorten-url";
import { transformSwaggerSchema } from "@/infra/http/transform-swagger-schema";
import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, request, reply) => {
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

// server.register(fastifyMultipart);
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
// server.register(getUploadsRoute);
// server.register(exportUploadsRoute);

server.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP Server running!");
});
