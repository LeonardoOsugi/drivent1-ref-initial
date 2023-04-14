import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { typeTicketsGet, ticketGet, ticketPost } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', typeTicketsGet).get('/', ticketGet).post('/', ticketPost);

export { ticketsRouter };
