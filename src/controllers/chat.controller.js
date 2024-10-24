import { validationResult } from 'express-validator';

import ApiError from '../exeptions/api.error.js';

import * as chatService from '../services/chat.service.js';
import * as userService from '../services/user.service.js';

export const create = async (req, res) => {
  const validationResults = validationResult(req);

  if (!validationResults.isEmpty()) {
    throw ApiError.badRequest(validationResults.array());
  }

  const { title } = req.body;
  const { email } = res.locals.user;

  const chat = await chatService.createChat(title);
  const user = await userService.findUser(email);

  await chatService.joinToChat(user, chat);

  return res.send({
    chat: chatService.secureChat(chat),
  });
};

export const rename = async (req, res) => {
  const validationResults = validationResult(req);

  if (!validationResults.isEmpty()) {
    throw ApiError.badRequest(validationResults.array());
  }

  const { id } = req.params;
  const { title } = req.body;

  const chat = await chatService.findChatById(id);

  if (!chat) {
    throw ApiError.notFound();
  }

  chatService.rename(chat, title);

  res.send(chatService.secureChat(chat));
};

export const join = async (req, res) => {
  const validationResults = validationResult(req);

  if (!validationResults.isEmpty()) {
    throw ApiError.badRequest(validationResults.array());
  }

  const { id } = req.params;
  const { email } = res.locals.user;

  const chat = await chatService.findChatById(id);
  const user = await userService.findUser(email);

  if (!chat) {
    throw ApiError.notFound();
  }

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  await chatService.joinToChat(user, chat);

  return res.sendStatus(200);
};

export const leave = async (req, res) => {
  const validationResults = validationResult(req);

  if (!validationResults.isEmpty()) {
    throw ApiError.badRequest(validationResults.array());
  }

  const { id } = req.params;
  const { email } = res.locals.user;

  const chat = await chatService.findChatById(id);
  const user = await userService.findUser(email);

  if (!chat) {
    throw ApiError.notFound();
  }

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  user.removeChat(chat);

  return res.sendStatus(200);
};

export const deleteChat = async (req, res) => {
  const validationResults = validationResult(req);

  if (!validationResults.isEmpty()) {
    throw ApiError.badRequest(validationResults.array());
  }

  const { id } = req.params;

  const chat = await chatService.findChatById(id);

  if (!chat) {
    throw ApiError.notFound();
  }

  await chatService.deleteChat(chat);

  return res.sendStatus(200);
};
