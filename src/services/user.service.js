import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import * as emailService from '../services/email.service.js';
import * as tokenService from '../services/token.service.js';

import User from '../models/User.js';
import ApiError from '../exeptions/api.error.js';
import { hashPassword } from '../utils/helpers.js';

export const secureUser = ({ email, name, phone }) => {
  return {
    email,
    phone,
    name,
  };
};

export const findUser = (email) => User.findOne({ where: { email } });

export const findUserByActivationToken = (activationToken) =>
  User.findOne({ where: { activationToken } });

export const findUserByResetPasswordToken = (resetPasswordToken) =>
  User.findOne({ where: { resetPasswordToken } });

export const findUserByActivationNewEmailToken = (activationNewEmailToken) =>
  User.findOne({ where: { activationNewEmailToken } });

export const createUser = async ({
  email,
  password,
  phone,
  name,
  activationToken,
}) => {
  return User.create({
    email,
    password,
    phone,
    name,
    activationToken,
  });
};

export const setActivationToken = async (user, token) => {
  user.activationToken = token;
  user.save();
};

export const setResetPasswordToken = async (user, token) => {
  user.resetPasswordToken = token;
  user.save();
};

export const changeName = async ({ email, newName }) => {
  const user = await findUser(email);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  user.name = newName;
  await user.save();

  return secureUser(user);
};

export const changeEmail = async ({ email, password, newEmail }) => {
  const user = await findUser(email);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.badRequest('Invalid password');
  }

  const isNewEmailTaken = await findUser(newEmail);

  if (isNewEmailTaken) {
    throw ApiError.badRequest('New email is alredy used in another account');
  }

  const activationToken = uuidv4();

  user.activationToken = activationToken;
  user.newEmail = newEmail;
  await user.save();

  emailService.sendActivationNewEmail(newEmail, activationToken);

  return secureUser(user);
};

export const activateNewEmail = async ({ activationNewEmailToken }) => {
  const user = await findUserByActivationNewEmailToken(activationNewEmailToken);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const oldEmail = user.email;

  user.email = user.newEmail;
  user.activationNewEmailToken = null;
  user.newEmail = null;
  await user.save();

  emailService.sendChangedEmail(oldEmail, user.email);
};

export const setPassword = async (user, password) => {
  user.password = password;
  user.save();
};

export const changePassword = async ({
  refreshToken,
  email,
  password,
  newPassword,
}) => {
  const user = await findUser(email);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.badRequest('Invalid password');
  }

  user.password = await hashPassword(newPassword);
  user.save();

  await tokenService.deleteAllTokenByUserIdAndCurrentToken(
    user.id,
    refreshToken,
  );
};
