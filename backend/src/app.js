import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorHandler } from "./utils/ApiError.js"

// Routes will be imported and mounted in later phases
// import adminRouter from "./routes/adminRoute.js"
// import doctorRouter from "./routes/doctorRoute.js"
// import userRouter from "./routes/userRoute.js"

const app = express()

// ─── CORS — allow both user frontend and admin panel ─────────────────────────
// credentials: true is required for httpOnly cookies to be sent cross-origin.
// The origin array explicitly lists both allowed frontends.
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN_USER,   // e.g. http://localhost:5173 (patient app)
    process.env.CORS_ORIGIN_ADMIN,  // e.g. http://localhost:5174 (admin panel)
  ],
  credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// ─── Routes (mounted in later phases) ────────────────────────────────────────
// app.use("/api/admin", adminRouter)
// app.use("/api/doctor", doctorRouter)
// app.use("/api/user", userRouter)

// ─── Global error handler — must be LAST ─────────────────────────────────────
// Catches anything forwarded by asyncHandler's next(err).
// Returns consistent JSON instead of Express's default HTML error page.
app.use(errorHandler)

export { app }
