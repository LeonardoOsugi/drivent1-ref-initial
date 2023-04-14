import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketService from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function typeTicketsGet(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await ticketService.typeTicketsGet();

    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (err) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function ticketGet(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const ticket = await ticketService.ticketGet(userId);
    return res.status(httpStatus.OK).send(ticket);
  } catch (err) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
