import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function typeTicketsGet() {
  return prisma.ticketType.findMany();
}

async function ticketGet(id: number): Promise<Ticket & { TicketType: TicketType }> {
  return await prisma.ticket.findFirst({
    where: {
      Enrollment: {
        id,
      },
    },
    include: {
      TicketType: true,
    },
  });
}

async function ticketPost(enrollmentId: number, ticketTypeId: number) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status: 'RESERVED',
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketRepositories = {
  typeTicketsGet,
  ticketGet,
  ticketPost,
};

export default ticketRepositories;
