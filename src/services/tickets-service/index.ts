import { notFoundError } from '@/errors';
import { TypeTicket } from '@/protocols';
import ticketRepositories from '@/repositories/tickets-repository';

async function typeTicketsGet(): Promise<TypeTicket[]> {
  const ticketType = await ticketRepositories.typeTicketsGet();

  return ticketType;
}

const ticketService = {
  typeTicketsGet,
};

export default ticketService;
