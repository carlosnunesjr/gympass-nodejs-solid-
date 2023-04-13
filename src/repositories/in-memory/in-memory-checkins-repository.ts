import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../checkins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findById(checkInId: string) {
    const checkIn = this.items.find(item => item.id === checkInId);

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async countByUserId(userId: string) {
    return this.items.filter(item => item.user_id === userId).length;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter(item => item.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date()
    };

    this.items.push(checkIn);

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.items.find(item => {
      const ckeckInDate = dayjs(item.created_at);
      const isOnSameDate =
        ckeckInDate.isAfter(startOfTheDay) && ckeckInDate.isBefore(endOfTheDay);

      return item.user_id === userId && isOnSameDate;
    });

    if (!checkInOnSameDate) {
      return null;
    }

    return checkInOnSameDate;
  }

  async save(data: CheckIn) {
    const checkInIndex = this.items.findIndex(item => item.id === data.id);

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = data;
    }

    return data;
  }
}
