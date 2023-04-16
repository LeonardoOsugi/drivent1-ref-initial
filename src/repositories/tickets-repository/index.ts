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

async function getTicketById(id: number): Promise<Ticket> {
  return await prisma.ticket.findFirst({ where: { id }, include: { TicketType: true, Enrollment: true } });
}

async function getUserTicketById(ticketId: number, userId: number) {
  return await prisma.ticket.findFirst({
    where: { id: ticketId, Enrollment: { id: userId } },
    include: {
      Enrollment: true,
    },
  });
}

const ticketRepositories = {
  typeTicketsGet,
  ticketGet,
  ticketPost,
  getTicketById,
  getUserTicketById,
};

export default ticketRepositories;
