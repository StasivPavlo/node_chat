import { Op } from 'sequelize';
import Token from '../models/Token.js';

export const createToken = async (userId, token) => {
  return Token.create({
    token,
    userId,
  });
};

export const findTokenByUserId = async (userId) => {
  return Token.findOne({ where: { userId } });
};

export const findTokenByToken = async (token) => {
  return Token.findOne({ where: { token } });
};

export const deleteTokenByToken = async (token) => {
  return Token.destroy({ where: { token } });
};

export const deleteAllTokenByUserId = async (userId) => {
  return Token.destroy({ where: { userId } });
};

export const deleteAllTokenByUserIdAndCurrentToken = async (userId, token) => {
  return Token.destroy({
    where: { userId, token: { [Op.not]: token } },
  });
};
