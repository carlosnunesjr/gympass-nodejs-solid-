import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-auhenticate-user";

describe("Validate CheckIn Controler (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get metrics of the check-ins by user", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const createGymResponse = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Teste e2e gym",
        description: "Some description",
        phone: "11984788789",
        latitude: -23.611679,
        longitude: -46.6801928
      });

    const gym = createGymResponse.body.gym;

    const checkInRespose = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -23.611679,
        longitude: -46.6801928
      });

    const { checkIn } = checkInRespose.body;

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);
  });
});
