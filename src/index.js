'use strict';

import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

import authRouter from './routers/auth.route.js';
import chatRouter from './routers/chat.route.js';

import {
  authMiddleware,
  authSocketMiddleware,
} from './middlewares/authMiddleware.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

import * as messagesController from './controllers/messages.controller.js';

import './utils/associations.js';

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

const io = new Server(server, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});

io.use(authSocketMiddleware);

io.on('connection', messagesController.socketConnectionController);

io.on('connection', (socket) => {
  socket.on('message', messagesController.socketMessageController(socket));
});

instrument(io, {
  auth: false,
  mode: 'development',
});
