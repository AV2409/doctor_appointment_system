class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.success = false
    this.errors = errors

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

// ─── Global error handler ─────────────────────────────────────────────────────
// Must be registered as the LAST middleware in app.js (after all routes).
// asyncHandler forwards errors here via next(err).
// Ensures all errors return JSON — never Express's default HTML error page.
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  })
}

export { ApiError, errorHandler }
