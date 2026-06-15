import { ApiError } from "../utils/ApiError.js"

// Used after verifyJWT to restrict a route to specific roles.
// Pass one or more allowed roles: authorize("USER"), authorize("DOCTOR"),
// authorize("ADMIN", "DOCTOR") — any matching role is permitted.
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
