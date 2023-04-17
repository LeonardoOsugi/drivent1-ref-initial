import { Payment } from '@prisma/client';
import { notFoundError, unauthorizedError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentRepositories from '@/repositories/payments-repository';
import ticketRepositories from '@/repositories/tickets-repository';
import { PayObj } from '@/protocols';

async function paymentGet(ticketId: number, userId: number): Promise<Payment> {
  const enrollmetResult = await enrollmentRepository.findWithAddressByUserId(userId);

  const ticketIdExist = await ticketRepositories.getTicketById(ticketId);

  if (!ticketIdExist) throw notFoundError();

  if (enrollmetResult.id !== ticketIdExist.enrollmentId) throw unauthorizedError();

  const payment = await paymentRepositories.paymentGet(ticketId);

  return payment;
}

async function paymentProcessPost(userId: number, data: PayObj): Promise<Payment> {
  const ticketExist = await paymentRepositories.ticketById(data.ticketId);

  if (!ticketExist) throw notFoundError();

  if (userId !== ticketExist.Enrollment.userId) throw unauthorizedError();

  const payment = await paymentRepositories.createPayment(data, ticketExist.TicketType.price);

  const status = 'PAID';

  await ticketRepositories.ticketPost(ticketExist.ticketTypeId, ticketExist.enrollmentId, status, ticketExist.id);

  return payment;
}

const paymentService = {
  paymentGet,
  paymentProcessPost,
};

export default paymentService;
