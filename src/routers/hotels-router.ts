import { Router } from 'express';
import { hotelsGet } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', hotelsGet);

export { hotelsRouter };
