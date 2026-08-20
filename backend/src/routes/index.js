import { Router } from 'express';
import authRoutes from './auth.routes.js';
import requestRoutes from './request.routes.js';
import userRoutes from './user.routes.js';
import { domain, APP_NAME } from '../../../shared/domain.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ success: true, status: 'ok', domain: domain.key, app: APP_NAME }));
router.use('/auth', authRoutes);
router.use('/requests', requestRoutes);
router.use('/users', userRoutes);

export default router;
