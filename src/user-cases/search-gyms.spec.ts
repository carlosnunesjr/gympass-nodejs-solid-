import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUserCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUserCase;
describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUserCase(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      id: "gym-01",
      title: "Test 01",
      description: "",
      phone: "",
      latitude: -23.611679,
      longitude: -46.6801928
    });

    await gymsRepository.create({
      id: "gym-02",
      title: "Test 02",
      description: "",
      phone: "",
      latitude: -23.5883193,
      longitude: -46.5958212
    });

    const { gyms } = await sut.execute({ query: "Test", page: 1 });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ id: "gym-01" }),
      expect.objectContaining({ id: "gym-02" })
    ]);
  });

  it("should be able to fetch paginate gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: `gym-${i}`,
        title: `Test ${i}`,
        description: "",
        phone: "",
        latitude: -23.611679,
        longitude: -46.6801928
      });
    }

    const { gyms } = await sut.execute({ query: "Test", page: 2 });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Test 21" }),
      expect.objectContaining({ title: "Test 22" })
    ]);
  });
});
