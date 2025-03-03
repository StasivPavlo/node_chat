'use strict';

import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import cors from 'cors';

import authRouter from './routers/auth.route.js';
import userRouter from './routers/user.route.js';
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

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/user', authMiddleware, userRouter);
app.use('/chat', authMiddleware, chatRouter);

app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://admin.socket.io'],
    credentials: true,
  },
});

io.use(authSocketMiddleware);

io.on('connection', messagesController.socketConnection);

io.on('connection', (socket) => {
  socket.on('message', messagesController.socketMessage(socket));
  socket.on('joinToChat', messagesController.socketJoinToChat(socket));
});

instrument(io, {
  auth: false,
});
