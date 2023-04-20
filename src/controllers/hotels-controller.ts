import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function hotelsGet(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const hotel = await hotelsService.hotelsGet(userId);
    return res.status(httpStatus.OK).send(hotel);
  } catch (e) {
    next(e);
  }
}
