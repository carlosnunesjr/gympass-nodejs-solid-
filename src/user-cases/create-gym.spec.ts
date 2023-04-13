import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { CreateGymUserCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUserCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUserCase(gymsRepository);
  });

  it("should be able to gym", async () => {
    const { gym } = await sut.execute({
      title: "Academy 01",
      description: null,
      phone: null,
      latitude: -23.611679,
      longitude: -46.6801928
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
