import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-auhenticate-user";

describe("Create Gym Controler (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Teste e2e gym",
        description: "Some description",
        phone: "11984788789",
        latitude: -23.611679,
        longitude: -46.6801928
      });

    expect(response.statusCode).toEqual(201);
  });
});
