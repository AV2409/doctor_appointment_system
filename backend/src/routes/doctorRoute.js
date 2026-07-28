import { Router } from "express"
import {
  doctorList,
  loginDoctor,
  logoutDoctor,
  refreshDoctorAccessToken,
  changeAvailablity,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
} from "../controllers/doctorController.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/role.middleware.js"

const doctorRouter = Router()

doctorRouter.get("/list",           doctorList)
doctorRouter.post("/login",         loginDoctor)
doctorRouter.post("/refresh-token", refreshDoctorAccessToken)

doctorRouter.post("/logout",               verifyJWT, authorize("DOCTOR"), logoutDoctor)
doctorRouter.get("/appointments",          verifyJWT, authorize("DOCTOR"), appointmentsDoctor)
doctorRouter.post("/complete-appointment", verifyJWT, authorize("DOCTOR"), appointmentComplete)
doctorRouter.post("/cancel-appointment",   verifyJWT, authorize("DOCTOR"), appointmentCancel)
doctorRouter.get("/dashboard",             verifyJWT, authorize("DOCTOR"), doctorDashboard)
doctorRouter.get("/profile",               verifyJWT, authorize("DOCTOR"), doctorProfile)
doctorRouter.post("/update-profile",       verifyJWT, authorize("DOCTOR"), updateDoctorProfile)

doctorRouter.post("/change-availability",  verifyJWT, authorize("DOCTOR"), changeAvailablity)

export default doctorRouter
