export const password = {
  trim: true,
  isLength: { options: { min: 8, max: 20 } },
};

export const name = {
  trim: true,
  isLength: { options: { min: 2, max: 40 } },
  notEmpty: true,
};
