import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import { sendCancellationEmails } from "../utils/appointmentEmails.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new ApiError(401, "Invalid admin credentials");
  }

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

const logoutAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Admin logged out"));
});

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

  if (!imageFile) {
    throw new ApiError(400, "Doctor image is required");
  }

  const uploadResult = await uploadOnCloudinary(imageFile.path);
  if (!uploadResult?.url) {
    throw new ApiError(500, "Error uploading doctor image");
  }

  let parsedAddress;
  try {
    parsedAddress = JSON.parse(address);
  } catch {
    throw new ApiError(400, "Invalid address format");
  }

  const doctor = await doctorModel.create({
    name,
    email,
    image: uploadResult.url,
    password,
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

const allDoctors = asyncHandler(async (req, res) => {
  const doctors = await doctorModel.find({}).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, doctors, "Doctors fetched successfully"));
});

const appointmentsAdmin = asyncHandler(async (req, res) => {
  const appointments = await appointmentModel.find({});
  return res
    .status(200)
    .json(
      new ApiResponse(200, appointments, "Appointments fetched successfully"),
    );
});

const appointmentCancel = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;

  const appointmentData = await appointmentModel.findById(appointmentId);
  if (!appointmentData) {
    throw new ApiError(404, "Appointment not found");
  }
  if (appointmentData.cancelled) {
    throw new ApiError(400, "Appointment already cancelled");
  }
  if (appointmentData.isCompleted) {
    throw new ApiError(400, "Completed appointments cannot be cancelled");
  }

  if (appointmentData.payment) {
    throw new ApiError(400, "Paid appointments cannot be cancelled");
  }

  await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

  const { docId, slotDate, slotTime } = appointmentData;
  const docData = await doctorModel.findById(docId);
  if (!docData) {
    throw new ApiError(404, "Doctor not found");
  }
  const slots_booked = docData.slots_booked;
  slots_booked[slotDate] = (slots_booked[slotDate] || []).filter(
    (t) => t !== slotTime,
  );
  await doctorModel.findByIdAndUpdate(docId, { slots_booked });

  sendCancellationEmails(appointmentData, "ADMIN");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Appointment cancelled"));
});

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
