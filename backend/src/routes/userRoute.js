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
  paymentRazorpay,
  verifyRazorpay,
} from "../controllers/userController.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/role.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const userRouter = Router()

userRouter.post("/register",      registerUser)
userRouter.post("/login",         loginUser)
userRouter.post("/refresh-token", refreshAccessToken)   // no auth — this IS the auth recovery

userRouter.post("/logout",             verifyJWT, authorize("USER"), logoutUser)
userRouter.get("/get-profile",         verifyJWT, authorize("USER"), getProfile)
userRouter.post("/update-profile",     verifyJWT, authorize("USER"), upload.single("image"), updateProfile)
userRouter.post("/book-appointment",   verifyJWT, authorize("USER"), bookAppointment)
userRouter.get("/appointments",        verifyJWT, authorize("USER"), listAppointments)
userRouter.post("/cancel-appointment", verifyJWT, authorize("USER"), cancelAppointment)

userRouter.post("/payment-razorpay", verifyJWT, authorize("USER"), paymentRazorpay)
userRouter.post("/verifyRazorpay",   verifyJWT, authorize("USER"), verifyRazorpay)

export default userRouter
