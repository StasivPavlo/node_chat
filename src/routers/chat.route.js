import { Router } from 'express';

import * as chatValidator from './../validators/chat.validator.js';
import * as chatController from './../controllers/chat.controller.js';
import catchError from '../utils/catchError.js';

const router = Router();

router.post('/create', chatValidator.create, catchError(chatController.create));

router.put(
  '/:id/rename',
  chatValidator.rename,
  catchError(chatController.rename),
);

router.post('/:id/join', chatValidator.join, catchError(chatController.join));

router.post(
  '/:id/leave',
  chatValidator.leave,
  catchError(chatController.leave),
);

router.delete(
  '/:id/delete',
  chatValidator.deleteChat,
  catchError(chatController.deleteChat),
);

export default router;
