import { Enrollment, Hotel, Room, Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findByVariables(userId: number): Promise<
  Ticket & {
    Enrollment: Enrollment;
    TicketType: TicketType;
  }
> {
  return await prisma.ticket.findFirst({
    where: {
      Enrollment: { userId },
    },
    include: {
      Enrollment: true,
      TicketType: true,
    },
  });
}

async function hotelsExist(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}
async function hotelsRoomsExist(hotelId: number): Promise<
  Hotel & {
    Rooms: Room[];
  }
> {
  return prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

export default {
  findByVariables,
  hotelsExist,
  hotelsRoomsExist,
};
