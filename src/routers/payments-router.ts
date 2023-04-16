import { Router } from 'express';
import { paymentGet } from '@/controllers/payments-controller';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', paymentGet).post('/');

export { paymentsRouter };
