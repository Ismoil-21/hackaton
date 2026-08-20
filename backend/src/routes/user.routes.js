import { Router } from 'express';
import * as ctrl from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();
router.use(protect, restrictTo('admin'));

router.get('/', ctrl.list);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
