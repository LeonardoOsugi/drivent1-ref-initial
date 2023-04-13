import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketService from '@/services/tickets-service';

export async function typeTicketsGet(req: Request, res: Response) {
  try {
    const ticketTypes = await ticketService.typeTicketsGet();

    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (err) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
