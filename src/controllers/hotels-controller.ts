import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function hotelsGet(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId }: { userId: number } = req;
  try {
    const hotel = await hotelsService.hotelsGet(userId);
    return res.status(httpStatus.OK).send(hotel);
  } catch (e) {
    next(e);
  }
}

export async function hotelsGetId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { hotelId } = req.params;
  const idHotel = Number(hotelId);
  try {
    const hotel = await hotelsService.hotelsGetId(idHotel, userId);
    return res.status(httpStatus.OK).send(hotel);
  } catch (e) {
    next(e);
  }
}
