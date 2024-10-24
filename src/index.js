'use strict';

import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { WebSocketServer } from 'ws';

import './utils/associations.js';

import authRouter from './routers/auth.route.js';
import chatRouter from './routers/chat.route.js';

import authMiddleware from './middlewares/authMiddleware.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

import * as jwtService from './services/jwt.service.js';
import * as userService from './services/user.service.js';
import * as messagesController from './controllers/messages.controller.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/chat', authMiddleware, chatRouter);

app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running http://localhost:${PORT}`);
});

const wss = new WebSocketServer({
  server,
  verifyClient: async (info, done) => {
    const token = info.req.headers.authorization.split(' ')[1];

    try {
      const userFromToken = jwtService.verifyToken(token);

      const user = await userService.findUser(userFromToken.email);

      if (!user) {
        done(false, 404, 'User not found');

        return;
      }

      done(true);
    } catch (e) {
      done(false, 401, 'Unauthorized');
    }
  },
});

export const clients = new Map();

wss.on('connection', async (ws, req) => {
  const token = req.headers.authorization.split(' ')[1];
  const userFromToken = jwtService.verifyToken(token);

  clients.set(userFromToken.id, ws);

  ws.on('close', () => {
    clients.delete(userFromToken.id);
  });
});

wss.on('connection', messagesController.socketConnectionController);

wss.on('connection', async (ws, req) => {
  const token = req.headers.authorization.split(' ')[1];
  const userFromToken = jwtService.verifyToken(token);

  ws.on(
    'message',
    messagesController.socketMessageController(ws, userFromToken.id),
  );
});
