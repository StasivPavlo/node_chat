import ApiError from '../exeptions/api.error.js';
import * as jwtService from '../services/jwt.service.js';
import * as userService from '../services/user.service.js';

export const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    throw ApiError.unauthorized();
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    const verified = jwtService.verifyToken(token);

    if (!verified) {
      throw ApiError.unauthorized();
    }

    res.locals.user = verified;

    next();
  } catch (error) {
    throw ApiError.unauthorized();
  }
};

export const authSocketMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwtService.verifyToken(token);
    const user = await userService.findUser(decoded.email);

    if (!user) {
      return next(new Error('NOT AUTHORIZED'));
    }
    socket.data.user = user;
  } catch (err) {
    return next(new Error('NOT AUTHORIZED'));
  }
  next();
};
