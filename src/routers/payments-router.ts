import { Router } from 'express';
import { paymentGet, paymentProcessPost } from '@/controllers/payments-controller';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', paymentGet).post('/process', paymentProcessPost);

export { paymentsRouter };
