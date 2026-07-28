import { Router } from "express"
import {
  loginAdmin,
  refreshAdminAccessToken,
  logoutAdmin,
  addDoctor,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
} from "../controllers/adminController.js"
import { changeAvailablity } from "../controllers/doctorController.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/role.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const adminRouter = Router()

adminRouter.post("/login",         loginAdmin)
adminRouter.post("/refresh-token", refreshAdminAccessToken)

adminRouter.post("/logout",             verifyJWT, authorize("ADMIN"), logoutAdmin)
adminRouter.post("/add-doctor",         verifyJWT, authorize("ADMIN"), upload.single("image"), addDoctor)
adminRouter.get("/all-doctors",         verifyJWT, authorize("ADMIN"), allDoctors)
adminRouter.get("/appointments",        verifyJWT, authorize("ADMIN"), appointmentsAdmin)
adminRouter.post("/cancel-appointment", verifyJWT, authorize("ADMIN"), appointmentCancel)
adminRouter.get("/dashboard",           verifyJWT, authorize("ADMIN"), adminDashboard)

adminRouter.post("/change-availability", verifyJWT, authorize("ADMIN", "DOCTOR"), changeAvailablity)

export default adminRouter
