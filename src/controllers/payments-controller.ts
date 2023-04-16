import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentService from '@/services/payments-service';

export async function paymentGet(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId }: { userId: number } = req;
  const ticketId: number = +req.query.ticketId;

  try {
    const payment = await paymentService.paymentGet(ticketId, userId);

    return res.status(httpStatus.OK).send(payment);
  } catch (err) {
    next(err);
  }
}
