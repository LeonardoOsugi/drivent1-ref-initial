import { Router } from 'express';
import { hotelsGet, hotelsGetId } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', hotelsGet).get('/:hotelId', hotelsGetId);

export { hotelsRouter };
