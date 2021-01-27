import { Router } from 'express';

import AppRoutes from './app.routes';
import UserRoutes from './user.routes';

const router = Router();
router.use('/find', AppRoutes);
router.use('/users', UserRoutes);

export default router;
