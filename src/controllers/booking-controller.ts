import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId }: { userId: number } = req;
  try {
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (e) {
    next(e);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId }: { userId: number } = req;
  const { roomId }: { roomId: number } = req.body;

  if (!roomId) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    const booking = await bookingService.postBooking(userId, roomId);
    return res.status(httpStatus.OK).send({ bookingId: booking });
  } catch (e) {
    next(e);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId }: { userId: number } = req;
  const bookingId = Number(req.params);
  const { roomId }: { roomId: number } = req.body;

  if (!roomId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const booking = await bookingService.putBooking(userId, bookingId, roomId);
    return res.status(200).send({ bookingId: booking });
  } catch (e) {
    next(e);
  }
}
