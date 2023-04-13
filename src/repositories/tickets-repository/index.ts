import { prisma } from '@/config';

async function typeTicketsGet() {
  return prisma.ticketType.findMany();
}

const ticketRepositories = {
  typeTicketsGet,
};

export default ticketRepositories;
