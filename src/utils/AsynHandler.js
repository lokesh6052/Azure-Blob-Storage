const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((next) =>
      next(error)
    );
  };
};

export { asyncHandler };
