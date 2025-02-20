import { checkSchema } from 'express-validator';

export const create = checkSchema(
  {
    title: {
      trim: true,
      isString: true,
      isLength: { options: { min: 4, max: 40 } },
      notEmpty: true,
    },
  },
  ['body'],
);

export const rename = checkSchema(
  {
    title: {
      trim: true,
      isString: true,
      isLength: { options: { min: 4, max: 40 } },
      notEmpty: true,
    },
    id: { isNumeric: true },
  },
  ['body', 'params'],
);

export const join = checkSchema(
  {
    id: { isNumeric: true },
  },
  ['params'],
);

export const leave = checkSchema(
  {
    id: { isNumeric: true },
  },
  ['params'],
);

export const deleteChat = checkSchema(
  {
    id: { isNumeric: true },
  },
  ['params'],
);
