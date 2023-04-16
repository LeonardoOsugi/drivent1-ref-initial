import { Enrollment, Payment, Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { PayObj } from '@/protocols';

async function paymentGet(ticketId: number) {
  return await prisma.payment.findFirst({ where: { ticketId } });
}

async function ticketById(ticketId: number): Promise<
  Ticket & {
    Enrollment: Enrollment;
    TicketType: TicketType;
  }
> {
  return await prisma.ticket.findFirst({
    where: { id: ticketId },
    include: {
      Enrollment: true,
      TicketType: true,
    },
  });
}

async function createPayment(data: PayObj, price: number): Promise<Payment> {
  return await prisma.payment.create({
    data: {
      ticketId: data.ticketId,
      value: price,
      cardIssuer: data.cardData.issuer,
      cardLastDigits: data.cardData.number.toString().slice(-4),
    },
  });
}

const paymentRepositories = {
  paymentGet,
  ticketById,
  createPayment,
};

export default paymentRepositories;
