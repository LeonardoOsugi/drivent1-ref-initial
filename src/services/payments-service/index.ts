import httpStatus from 'http-status';
import { notFoundError, requestError, unauthorizedError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentRepositories from '@/repositories/payments-repository';
import ticketRepositories from '@/repositories/tickets-repository';

async function paymentGet(ticketId: number, userId: number) {
  const enrollmetResult = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!ticketId) throw requestError(httpStatus.BAD_REQUEST, httpStatus['400_MESSAGE']);

  const ticketIdExist = await ticketRepositories.getTicketById(ticketId);

  if (enrollmetResult.id !== ticketIdExist.enrollmentId) throw unauthorizedError();

  if (!ticketIdExist) throw notFoundError();

  const payment = await paymentRepositories.paymentGet(ticketId);

  return payment;
}

const paymentService = {
  paymentGet,
};

export default paymentService;
