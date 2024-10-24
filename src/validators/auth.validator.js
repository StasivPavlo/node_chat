import { checkSchema } from 'express-validator';

export const login = checkSchema(
  {
    email: { isEmail: true },
    password: {
      isLength: { options: { min: 8, max: 40 } },
      trim: true,
      notEmpty: true,
    },
  },
  ['body'],
);

export const register = checkSchema(
  {
    email: { isEmail: true },
    password: {
      isLength: { options: { min: 8, max: 40 } },
      trim: true,
      notEmpty: true,
    },
  },
  ['body'],
);
