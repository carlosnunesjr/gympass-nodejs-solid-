import { FetchNearbyGymsUserCase } from "../fetch-nearby-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeFetchNearbyGymsUseCase() {
  const repository = new PrismaGymsRepository();
  const useCase = new FetchNearbyGymsUserCase(repository);

  return useCase;
}
