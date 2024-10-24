import User from './src/models/User.js';
import Token from './src/models/Token.js';
import Chat from './src/models/Chat.js';
import sequelize from './src/utils/db.js';

sequelize.sync({ force: true });
