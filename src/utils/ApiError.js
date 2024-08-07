class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    stack = "",
    Errors = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.Errors = Errors;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
