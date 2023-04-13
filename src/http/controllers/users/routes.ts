import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

import { register } from "./register-controler";
import { authenticate } from "./authenticate-controler";
import { profile } from "./profile-controller";
import { refresh } from "./refresh-controller";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.patch("/token/refresh", refresh);

  /*Authenticated*/
  app.get("/me", { onRequest: [verifyJWT] }, profile);
}
