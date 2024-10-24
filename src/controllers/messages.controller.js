import * as jwtService from '../services/jwt.service.js';
import * as chatService from '../services/chat.service.js';
import * as userService from '../services/user.service.js';

import { clients } from './../index.js';

export const socketConnectionController = async (ws, req) => {
  const token = jwtService.verifyToken(req.headers.authorization.split(' ')[1]);

  const user = await userService.findUser(token.email);

  const allUserChats = await chatService.getAllUserChats(user);

  allUserChats.forEach((chat) => {
    ws.send(JSON.stringify(chatService.secureChat(chat)));
  });
};

export const socketMessageController = (ws, userId) => {
  return async (message) => {
    const { chatId, message: messageText } = JSON.parse(message);

    const chat = await chatService.findChatById(chatId);

    if (!chat) {
      ws.send(JSON.stringify({ error: 'chat not found' }));

      return;
    }

    const chatMembers = await chatService.getChatMembers(chat);

    const savedMessage = await chatService.saveMessage(
      userId,
      chat,
      messageText,
    );

    for (const [key, value] of clients.entries()) {
      const isClientMember = chatMembers.some((member) => member.id === key);

      if (key !== userId && isClientMember) {
        await value.send(JSON.stringify(savedMessage));
      }
    }
  };
};
