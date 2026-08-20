import { Router } from 'express';
import * as ctrl from '../controllers/request.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.use(protect);

router.get('/stats', ctrl.stats);
router
  .route('/')
  .get(ctrl.list)
  .post(validate({ title: ['required', ['min', 3], ['max', 140]] }), ctrl.create);
router.route('/:id').get(ctrl.getOne).patch(ctrl.update).delete(ctrl.remove);

export default router;
