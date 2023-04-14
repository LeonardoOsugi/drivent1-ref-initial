import { Ticket, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepositories from '@/repositories/tickets-repository';
import { TypeTicket } from '@/protocols';

async function typeTicketsGet(): Promise<TypeTicket[]> {
  const ticketType = await ticketRepositories.typeTicketsGet();

  return ticketType;
}

async function ticketGet(userId: number): Promise<Ticket & { TicketType: TicketType }> {
  const enrollmetResult = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmetResult) throw notFoundError();

  const ticket = await ticketRepositories.ticketGet(enrollmetResult.id);

  if (!ticket) throw notFoundError();

  return ticket;
}

const ticketService = {
  typeTicketsGet,
  ticketGet,
};

export default ticketService;
