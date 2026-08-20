import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/register',
  validate({
    name: ['required', ['min', 2], ['max', 60]],
    email: ['required', 'email'],
    password: ['required', ['min', 6]],
  }),
  ctrl.register
);
router.post('/login', validate({ email: ['required', 'email'], password: ['required'] }), ctrl.login);
router.post('/logout', protect, ctrl.logout);
router.get('/me', protect, ctrl.me);

export default router;
