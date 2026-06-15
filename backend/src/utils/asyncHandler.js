// Eliminates repetitive try/catch from every controller function.
// Wraps an async controller and forwards any rejection to Express next(err),
// which is then handled by the global errorHandler middleware in app.js.
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
