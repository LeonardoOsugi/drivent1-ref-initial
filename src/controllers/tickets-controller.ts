import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketService from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function typeTicketsGet(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const ticketTypes = await ticketService.typeTicketsGet();

    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (err) {
    return next(err);
  }
}

export async function ticketGet(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId }: { userId: number } = req;
  try {
    const ticket = await ticketService.ticketGet(userId);
    return res.status(httpStatus.OK).send(ticket);
  } catch (err) {
    return next(err);
  }
}

export async function ticketPost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { ticketTypeId }: { ticketTypeId: number } = req.body;
  const { userId }: { userId: number } = req;
  try {
    const post = await ticketService.ticketPost(ticketTypeId, userId);
    return res.status(httpStatus.CREATED).send(post);
  } catch (err) {
    return next(err);
  }
}
