import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumbersOfCheckInsError } from "./errors/max-numbers-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;
describe("Check In Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Test 01",
      description: "",
      phone: "",
      latitude: -23.611679,
      longitude: -46.6801928
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -23.611679,
      userLongitude: -46.6801928
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2023, 3, 5, 16, 40, 33));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -23.611679,
      userLongitude: -46.6801928
    });

    await expect(
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -23.611679,
        userLongitude: -46.6801928
      })
    ).rejects.toBeInstanceOf(MaxNumbersOfCheckInsError);
  });

  it("should be able to check in twice in the different days", async () => {
    vi.setSystemTime(new Date(2023, 3, 5, 16, 40, 33));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -23.611679,
      userLongitude: -46.6801928
    });

    vi.setSystemTime(new Date(2023, 3, 4, 16, 40, 33));

    await expect(
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -23.611679,
        userLongitude: -46.6801928
      })
    ).resolves.toBeTruthy();
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Test 02",
      description: "",
      phone: "",
      latitude: new Decimal(-23.5883193),
      longitude: new Decimal(-46.5958212)
    });

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-02",
        userLatitude: -23.611679,
        userLongitude: -46.6801928
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
