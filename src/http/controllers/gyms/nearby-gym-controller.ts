import { makeFetchNearbyGymsUseCase } from "@/user-cases/factories/make-fetch-nearby-gyms-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymQuerySchema = z.object({
    latitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 190;
    })
  });

  const { latitude, longitude } = nearbyGymQuerySchema.parse(request.query);

  const searchGymUserCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await searchGymUserCase.execute({
    userLatitude: latitude,
    userLongitude: longitude
  });

  return reply.status(200).send({ gyms });
}
