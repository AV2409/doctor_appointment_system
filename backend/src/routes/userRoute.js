import { Router } from "express"
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
} from "../controllers/userController.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/role.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

// Payment routes will be added in a later phase:
// paymentRazorpay, verifyRazorpay

const userRouter = Router()

// ─── Public ───────────────────────────────────────────────────────────────────
userRouter.post("/register",      registerUser)
userRouter.post("/login",         loginUser)
userRouter.post("/refresh-token", refreshAccessToken)   // no auth — this IS the auth recovery

// ─── Protected — USER only ────────────────────────────────────────────────────
userRouter.post("/logout",             verifyJWT, authorize("USER"), logoutUser)
userRouter.get("/get-profile",         verifyJWT, authorize("USER"), getProfile)
userRouter.post("/update-profile",     verifyJWT, authorize("USER"), upload.single("image"), updateProfile)
userRouter.post("/book-appointment",   verifyJWT, authorize("USER"), bookAppointment)
userRouter.get("/appointments",        verifyJWT, authorize("USER"), listAppointments)
userRouter.post("/cancel-appointment", verifyJWT, authorize("USER"), cancelAppointment)

export default userRouter
