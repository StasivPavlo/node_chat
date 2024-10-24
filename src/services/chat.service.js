import Chat from '../models/Chat.js';

export const secureChat = ({ id, title, messages }) => {
  return {
    id,
    title,
    messages,
  };
};

export const findChatById = (id) => Chat.findByPk(id);

export const createChat = (title) => Chat.create({ title });

export const joinToChat = (user, chat) => user.addChat(chat);

export const rename = (chat, newTitle) => {
  chat.title = newTitle;

  chat.save();
};

export const deleteChat = (chat) => chat.destroy();

export const saveMessage = (userId, chat, message) => {
  const newMessage = {
    message,
    userId,
    time: new Date().toISOString(),
  };

  chat.messages = [...chat.messages, newMessage];

  chat.save();

  return newMessage;
};

export const getChatMembers = (chat) => chat.getUsers();

export const getAllUserChats = (user) => user.getChats();
