import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentService from '@/services/payments-service';
import { PayObj } from '@/protocols';

export async function paymentGet(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId }: { userId: number } = req;
  const ticketId: number = +req.query.ticketId;

  if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const payment = await paymentService.paymentGet(ticketId, userId);

    return res.status(httpStatus.OK).send(payment);
  } catch (err) {
    next(err);
  }
}

export async function paymentProcessPost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const data = req.body as PayObj;

  if (!data.ticketId || !data.cardData) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const payment = await paymentService.paymentProcessPost(userId, data);
    return res.status(httpStatus.OK).send(payment);
  } catch (err) {
    next(err);
  }
}
