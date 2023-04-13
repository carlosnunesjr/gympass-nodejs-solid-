import { makeFetchUserCheckInsHistoryUseCase } from "@/user-cases/factories/make-fetch-user-check-ins-history-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const userHistoryCheckInsQuerySchema = z.object({
    page: z.coerce.number().max(1).default(1)
  });

  const { page } = userHistoryCheckInsQuerySchema.parse(request.query);

  const fetchUserHistoryCheckInsUserCase =
    makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await fetchUserHistoryCheckInsUserCase.execute({
    page,
    userId: request.user.sub
  });

  return reply.status(200).send({ checkIns });
}
