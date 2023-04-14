import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { typeTicketsGet, ticketGet } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', typeTicketsGet).get('/', ticketGet).post('/');

export { ticketsRouter };
