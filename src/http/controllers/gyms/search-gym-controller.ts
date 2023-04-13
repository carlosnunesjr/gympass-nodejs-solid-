import { makeSearchGymsUseCase } from "@/user-cases/factories/make-search-gyms-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().max(1).default(1)
  });

  const { q, page } = searchGymQuerySchema.parse(request.query);

  const searchGymUserCase = makeSearchGymsUseCase();

  const { gyms } = await searchGymUserCase.execute({ query: q, page });

  return reply.status(200).send({ gyms });
}
