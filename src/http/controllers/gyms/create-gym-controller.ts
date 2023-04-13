import { makeCreateGymUseCase } from "@/user-cases/factories/make-create-gym-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 190;
    })
  });

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body);

  const createGymUserCase = makeCreateGymUseCase();

  const { gym } = await createGymUserCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude
  });

  return reply.status(201).send({ gym });
}
