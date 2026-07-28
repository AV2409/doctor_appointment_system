import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/ApiError.js";

import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";

const app = express();

app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN_USER,
      process.env.CORS_ORIGIN_ADMIN,
    ],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("HMS Running");
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);

export { app };
