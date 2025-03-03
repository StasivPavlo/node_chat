import * as chatService from '../services/chat.service.js';

export const socketConnection = async (socket) => {
  const { user } = socket.data;
  const allUserChats = await chatService.getAllUserChats(user);

  socket.join(allUserChats.map(({ id }) => 'chat-' + id));
  socket.emit('chats', allUserChats);
};

export const socketMessage = (socket) => {
  return async (data) => {
    const chat = await chatService.findChatById(data.chatId);

    if (!chat) {
      throw new Error('chat not found');
    }

    const message = chatService.saveMessage(
      socket.data.user.id,
      chat,
      data.message,
    );

    socket
      .to('chat-' + chat.id)
      .emit('message', { ...message, chatId: chat.id });
  };
};

export const socketJoinToChat = (socket) => {
  return async (data) => {
    const chat = await chatService.findChatById(data.chatId);

    if (!chat) {
      throw new Error('chat not found');
    }

    socket.join('chat-' + chat.id);
  };
};
