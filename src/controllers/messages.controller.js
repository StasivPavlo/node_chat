import * as chatService from '../services/chat.service.js';

export const socketConnectionController = async (socket) => {
  const { user } = socket.data;
  const allUserChats = await chatService.getAllUserChats(user);

  socket.join(allUserChats.map(({ id }) => 'chat-' + id));

  socket.on('message', socketMessageController);
};

export const socketMessageController = (socket) => {
  return async (data) => {
    const chat = await chatService.findChatById(data.chatId);

    if (!chat) {
      throw new Error('chat not found');
    }

    const message = await chatService.saveMessage(
      socket.data.user.id,
      chat,
      data.message,
    );

    socket.to('chat-' + chat.id).emit('message', message);
  };
};
