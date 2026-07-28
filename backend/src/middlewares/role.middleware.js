import { ApiError } from "../utils/ApiError.js"

export const authorize = (...allowedRoles) => {
  return (req, _, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied — requires role: ${allowedRoles.join(" or ")}`
      )
    }
    next()
  }
}
