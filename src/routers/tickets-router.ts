import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { typeTicketsGet } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', typeTicketsGet);

export { ticketsRouter };
