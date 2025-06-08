import { getAllHedgehogs, addHedgehog, getHedgehogById } from "@server/application/hedgehog";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { Hedgehog, newHedgehogSchema } from "@shared/hedgehog";

export function hedgehogRouter(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: () => void
) {
  fastify.get("/", async function (_request, reply) {
    const hedgehogs = await getAllHedgehogs();

    return reply.code(200).send({
      hedgehogs,
    });
  });

  fastify.get<{ Params: { id: string } }>("/:id", async function (request, reply) {
    const { id } = request.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return reply.code(400).send({ error: "Invalid ID" });
    }

    const hedgehog = await getHedgehogById(numericId);

    if (!hedgehog) {
      return reply.code(404).send({ error: "Hedgehog not found" });
    }

    return reply.code(200).send({ hedgehog });
  });

  fastify.post<{ Body: Hedgehog }>("/add", async function (request, reply) {
    const parsed = newHedgehogSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid input", details: parsed.error.errors });
    }

    const input = parsed.data;

    // Call your DB insert function with validated input
    const hedgehog = await addHedgehog(input);

    return reply.code(200).send({
      hedgehog,
    });
  });

  done();
}
