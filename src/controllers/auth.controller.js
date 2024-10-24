import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import * as userService from '../services/user.service.js';
import * as jwtService from '../services/jwt.service.js';
import * as tokenService from '../services/token.service.js';
import ApiError from '../exeptions/api.error.js';

const sendAuthentification = async (res, user, oldRefreshToken) => {
  const secureUser = userService.secureUser(user);

  const accessToken = jwtService.createToken(secureUser);
  const refreshToken = jwtService.createRefreshToken(secureUser);

  await tokenService.createToken(user.id, refreshToken);

  if (oldRefreshToken) {
    await tokenService.deleteTokenByToken(oldRefreshToken);
  }

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  return res.status(200).json({ user: secureUser, accessToken });
};

export const login = async (req, res) => {
  const validationResults = validationResult(req);

  if (!validationResults.isEmpty()) {
    throw ApiError.badRequest(validationResults.array());
  }

  const { email, password } = req.body;

  const user = await userService.findUser(email);

  if (!user) {
    throw ApiError.notFound();
  }

  const isPasswordValid = bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.badRequest('Invalid password');
  }

  await sendAuthentification(res, user);
};

export const register = async (req, res) => {
  const validationResults = validationResult(req);

  if (!validationResults.isEmpty()) {
    throw ApiError.badRequest(validationResults.array());
  }

  const { email, password } = req.body;

  const user = await userService.findUser(email);

  if (user) {
    throw ApiError.badRequest('User already exists');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await userService.createUser(email, hashedPassword);

  return res.status(201).json({ message: 'User created' });
};

export const logout = async (req, res) => {
  res.clearCookie('refreshToken');

  const refreshToken = req.cookies.refreshToken || '';
  const userData = jwtService.verifyRefreshToken(refreshToken);

  if (userData) {
    await tokenService.deleteTokenByToken(refreshToken);
  }

  res.sendStatus(204);
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || '';
  const findedRefreshToken = await tokenService.findTokenByToken(refreshToken);

  if (!findedRefreshToken) {
    throw ApiError.unauthorized();
  }

  try {
    const userData = jwtService.verifyRefreshToken(refreshToken);

    if (!userData) {
      throw ApiError.unauthorized();
    }

    const user = await userService.findUser(userData.email);

    if (!user) {
      throw ApiError.notFound();
    }

    await sendAuthentification(res, user, refreshToken);
  } catch (error) {
    throw ApiError.unauthorized(error);
  }
};
