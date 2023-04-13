import { makeGetUserMetricsUseCase } from "@/user-cases/factories/make-get-user-metrics-usecase";
import { FastifyReply, FastifyRequest } from "fastify";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase();

  const { checkInsCount } = await getUserMetricsUseCase.execute({
    userId: request.user.sub
  });

  return reply.status(200).send({ checkInsCount });
}
