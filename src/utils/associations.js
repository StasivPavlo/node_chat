import User from './../models/User.js';
import Token from './../models/Token.js';
import Chat from './../models/Chat.js';

User.hasMany(Token, {
  foreignKey: 'userId',
});

Token.belongsTo(User, {
  foreignKey: 'userId',
});

User.belongsToMany(Chat, {
  through: 'UserChat',
  foreignKey: 'userId',
  otherKey: 'chatId',
  as: 'chats',
});

Chat.belongsToMany(User, {
  through: 'UserChat',
  foreignKey: 'chatId',
  otherKey: 'userId',
  as: 'users',
});
