import { prisma } from '@/config';

async function paymentGet(ticketId: number) {
  return await prisma.payment.findFirst({ where: { ticketId } });
}

const paymentRepositories = {
  paymentGet,
};

export default paymentRepositories;
