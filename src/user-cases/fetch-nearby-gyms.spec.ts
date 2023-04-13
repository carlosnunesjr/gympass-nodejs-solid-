import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUserCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUserCase;
describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUserCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      id: "gym-01",
      title: "Near Gym",
      description: "",
      phone: "",
      latitude: -23.611679,
      longitude: -46.6801928
    });

    await gymsRepository.create({
      id: "gym-02",
      title: "Far Gym",
      description: "",
      phone: "",
      latitude: -23.6443126,
      longitude: -46.5063857
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.5883193,
      userLongitude: -46.5958212
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
