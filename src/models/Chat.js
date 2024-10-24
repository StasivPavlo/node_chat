import sequelize from '../utils/db.js';
import { DataTypes } from '@sequelize/core';

const Chat = sequelize.define(
  'chat',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    messages: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {},
);

export default Chat;
