import { Router } from 'express';

import * as authController from '../controllers/auth.controller.js';
import * as authValidator from '../validators/auth.validator.js';
import catchError from '../utils/catchError.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', authValidator.login, catchError(authController.login));

router.post(
  '/register',
  authValidator.register,
  catchError(authController.register),
);

router.post('/logout', authMiddleware, catchError(authController.logout));
router.post('/refresh', catchError(authController.refresh));

export default router;
