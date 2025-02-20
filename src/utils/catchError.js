const catchError = (callback) => {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      next(error);
    }
  };
};

export default catchError;
