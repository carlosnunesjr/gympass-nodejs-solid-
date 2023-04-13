import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-auhenticate-user";

describe("Search Gyms Controler (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test1 e2e gym",
        description: "Some description",
        phone: "11984788789",
        latitude: -23.611679,
        longitude: -46.6801928
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test2 e2e gym",
        description: "Some description",
        phone: "11984788789",
        latitude: -23.611679,
        longitude: -46.6801928
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        q: "Test1"
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Test1 e2e gym"
      })
    ]);
  });
});
