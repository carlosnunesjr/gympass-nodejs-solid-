import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUserCase } from "../register-usecase";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const registerUserCase = new RegisterUserCase(usersRepository);

  return registerUserCase;
}
