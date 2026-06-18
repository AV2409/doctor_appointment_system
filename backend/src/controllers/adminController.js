import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import validator from "validator";
import jwt from "jsonwebtoken";

// bcrypt is NOT imported here — password hashing is handled by doctorModel's pre("save") hook

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

// ─── Login ─────────────────────────────────────────────────────────────────────
// Admin has no DB entry — credentials are stored in .env only.
// Token payload uses role: "ADMIN" — same shape as USER/DOCTOR tokens.
// Shared cookie names: accessToken / refreshToken — same as all other roles.
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new ApiError(401, "Invalid admin credentials");
  }

  // Uses shared ACCESS_TOKEN_SECRET and ACCESS_TOKEN_EXPIRY — no admin-specific vars
  const accessToken = jwt.sign(
    { role: "ADMIN", email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );

  const refreshToken = jwt.sign(
    { role: "ADMIN", email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );

  // Shared cookie names — same as user/doctor login
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Admin login successful",
      ),
    );
});

// ─── Refresh Admin Access Token ────────────────────────────────────────────────
// Reads from the shared refreshToken cookie — same as all other roles.
// Admin tokens are NOT stored in DB — validate role + email against env on each refresh.
const refreshAdminAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // Admin has no DB — re-validate role and email against env
  if (
    decodedToken.role !== "ADMIN" ||
    decodedToken.email !== process.env.ADMIN_EMAIL
  ) {
    throw new ApiError(403, "Not authorized as admin");
  }

  const newAccessToken = jwt.sign(
    { role: "ADMIN", email: decodedToken.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken },
        "Access token refreshed",
      ),
    );
});

// ─── Logout ────────────────────────────────────────────────────────────────────
// Admin refresh tokens are NOT stored in DB — logout only clears client-side cookies.
// A stolen admin refresh token remains valid until natural expiry (accepted tradeoff
// for a single-admin, env-based system — see spec Option A vs Option B discussion).
const logoutAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Admin logged out"));
});

// ─── Add Doctor ────────────────────────────────────────────────────────────────
// CRITICAL: do NOT manually hash the password here.
// doctorModel has a pre("save") hook that hashes the password automatically.
// Passing an already-hashed password to .create() would hash it TWICE,
// making doctor login impossible (bcrypt.compare would always fail).
const addDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    speciality,
    degree,
    experience,
    about,
    fees,
    address,
  } = req.body;
  const imageFile = req.file;

  if (
    !name ||
    !email ||
    !password ||
    !speciality ||
    !degree ||
    !experience ||
    !about ||
    !fees ||
    !address
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please enter a valid email");
  }
  const existingDoctor = await doctorModel.findOne({ email });
  if (existingDoctor) {
    throw new ApiError(409, "Doctor with this email already exists");
  }
  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  // Real Issue #1: explicit 400 when image is missing — avoids a misleading 500
  if (!imageFile) {
    throw new ApiError(400, "Doctor image is required");
  }

  const uploadResult = await uploadOnCloudinary(imageFile.path);
  if (!uploadResult?.url) {
    throw new ApiError(500, "Error uploading doctor image");
  }

  // Optional #2: safe JSON.parse — malformed address returns 400 not 500
  let parsedAddress;
  try {
    parsedAddress = JSON.parse(address);
  } catch {
    throw new ApiError(400, "Invalid address format");
  }

  // Pass plain password — the pre("save") hook in doctorModel hashes it.
  // DO NOT call bcrypt.hash() here — that would result in double hashing.
  const doctor = await doctorModel.create({
    name,
    email,
    image: uploadResult.url,
    password, // plain text — model hook hashes it
    speciality,
    degree,
    experience,
    about,
    available: true,
    fees: Number(fees),
    address: parsedAddress,
    date: Date.now(),
  });

  const createdDoctor = await doctorModel
    .findById(doctor._id)
    .select("-password -refreshToken");
  return res
    .status(201)
    .json(new ApiResponse(201, createdDoctor, "Doctor added successfully"));
});

// ─── All Doctors ───────────────────────────────────────────────────────────────
const allDoctors = asyncHandler(async (req, res) => {
  const doctors = await doctorModel.find({}).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, doctors, "Doctors fetched successfully"));
});

// ─── All Appointments ──────────────────────────────────────────────────────────
const appointmentsAdmin = asyncHandler(async (req, res) => {
  const appointments = await appointmentModel.find({});
  return res
    .status(200)
    .json(
      new ApiResponse(200, appointments, "Appointments fetched successfully"),
    );
});

// ─── Cancel Appointment (admin) ────────────────────────────────────────────────
// Admin can cancel any appointment — no ownership check required.
const appointmentCancel = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;

  const appointmentData = await appointmentModel.findById(appointmentId);
  if (!appointmentData) {
    throw new ApiError(404, "Appointment not found");
  }
  if (appointmentData.cancelled) {
    throw new ApiError(400, "Appointment already cancelled");
  }
  // Real Issue #2: consistent with doctor + user controllers — completed
  // appointments should not be cancellable (slot already used)
  if (appointmentData.isCompleted) {
    throw new ApiError(400, "Completed appointments cannot be cancelled");
  }

  await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

  // Release the slot back on the doctor's record
  const { docId, slotDate, slotTime } = appointmentData;
  const docData = await doctorModel.findById(docId);
  if (!docData) {
    throw new ApiError(404, "Doctor not found");
  }
  const slots_booked = docData.slots_booked;
  // Defensive fallback — avoids TypeError if slotDate key is missing
  slots_booked[slotDate] = (slots_booked[slotDate] || []).filter(
    (t) => t !== slotTime,
  );
  await doctorModel.findByIdAndUpdate(docId, { slots_booked });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Appointment cancelled"));
});

// ─── Admin Dashboard ───────────────────────────────────────────────────────────
const adminDashboard = asyncHandler(async (req, res) => {
  const [doctors, users, appointments] = await Promise.all([
    doctorModel.find({}),
    userModel.find({}),
    appointmentModel.find({}),
  ]);

  const dashData = {
    doctors: doctors.length,
    patients: users.length,
    appointments: appointments.length,
    // Spread to avoid mutation; sort by date desc for guaranteed ordering
    latestAppointments: [...appointments]
      .sort((a, b) => b.date - a.date)
      .slice(0, 5),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, dashData, "Dashboard data fetched"));
});

export {
  loginAdmin,
  refreshAdminAccessToken,
  logoutAdmin,
  addDoctor,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
};
