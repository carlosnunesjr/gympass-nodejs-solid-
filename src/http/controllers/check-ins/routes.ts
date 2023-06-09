import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";

import { create } from "./create-check-in-controller";
import { validate } from "./validate-check-in-controller";
import { history } from "./history-check-in-controller";
import { metrics } from "./metrics-check-in-controller";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/check-ins/history", history);
  app.get("/check-ins/metrics", metrics);

  app.post(
    "/gyms/:gymId/check-ins",
    { onRequest: [verifyUserRole("ADMIN")] },
    create
  );
  app.patch(
    "/check-ins/:checkInId/validate",
    { onRequest: [verifyUserRole("ADMIN")] },
    validate
  );
}
