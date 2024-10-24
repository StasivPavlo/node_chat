import User from '../models/User.js';

export const secureUser = ({ email, id }) => {
  return {
    id,
    email,
  };
};

export const findUser = (email) => User.findOne({ where: { email } });

export const createUser = async (email, password) => {
  const user = await User.create({
    email,
    password,
  });

  return user;
};
