import { Enrollment, Hotel, Ticket, TicketType } from '@prisma/client';
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

export default {
  findByVariables,
  hotelsExist,
};
