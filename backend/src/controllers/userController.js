import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import validator from "validator";
import jwt from "jsonwebtoken";

// ─── Cookie options ─────────────────────────────────────────────────────────
// secure: true only in production (HTTPS) — allows cookies over HTTP in dev
// sameSite: "none" in production (required for cross-origin cookie sending)
//           "lax" in development (works on localhost without HTTPS)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

// ─── Helper: generate both tokens and save refresh token to DB ───────────────
const generateAccessAndRefreshTokens = async (userId) => {
  const user = await userModel.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// ─── Register ────────────────────────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please enter a valid email");
  }
  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await userModel.create({ name, email, password });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );
  const createdUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user: createdUser, accessToken, refreshToken },
        "User registered successfully",
      ),
    );
});

// ─── Login ───────────────────────────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );
  const loggedInUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Login successful",
      ),
    );
});

// ─── Logout ──────────────────────────────────────────────────────────────────
const logoutUser = asyncHandler(async (req, res) => {
  await userModel.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true },
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// ─── Refresh Access Token ─────────────────────────────────────────────────────
const refreshAccessToken = asyncHandler(async (req, res) => {
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
    throw new ApiError(401, error.message || "Invalid refresh token");
  }

  // Explicit role guard — prevents a DOCTOR or ADMIN token from being used here
  if (decodedToken.role !== "USER") {
    throw new ApiError(401, "Invalid refresh token for this endpoint");
  }

  const user = await userModel.findById(decodedToken?._id);
  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // Reject if token does not match what is stored in DB (rotation check)
  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(
      401,
      "Refresh token is expired or has already been used",
    );
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed",
      ),
    );
});

// ─── Get Profile ──────────────────────────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const userData = await userModel
    .findById(req.user._id)
    .select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, userData, "Profile fetched successfully"));
});

// ─── Update Profile ───────────────────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, dob, gender } = req.body;
  const imageFile = req.file;

  if (!name || !phone || !dob || !gender) {
    throw new ApiError(400, "All fields are required");
  }

  const updateData = {
    name,
    phone,
    dob,
    gender,
  };

  // Bug 4 fix: safe JSON.parse — malformed address from frontend won't crash the server
  let parsedAddress;
  try {
    parsedAddress = JSON.parse(address);
  } catch {
    throw new ApiError(400, "Invalid address format");
  }
  updateData.address = parsedAddress;

  if (imageFile) {
    const uploadResult = await uploadOnCloudinary(imageFile.path);
    if (!uploadResult?.url) {
      throw new ApiError(500, "Error uploading profile image");
    }
    updateData.image = uploadResult.url;
  }

  await userModel.findByIdAndUpdate(req.user._id, updateData);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Profile updated successfully"));
});

// ─── Book Appointment ─────────────────────────────────────────────────────────
const bookAppointment = asyncHandler(async (req, res) => {
  const { docId, slotDate, slotTime } = req.body;
  const userId = req.user._id;

  const docData = await doctorModel.findById(docId).select("-password");
  // Bug 1 fix: null check before accessing .available
  if (!docData) {
    throw new ApiError(404, "Doctor not found");
  }
  if (!docData.available) {
    throw new ApiError(400, "Doctor is not available");
  }

  const slots_booked = docData.slots_booked;
  if (slots_booked[slotDate]?.includes(slotTime)) {
    throw new ApiError(400, "This slot is already booked");
  }

  // Add slot to doctor's booked list
  if (!slots_booked[slotDate]) slots_booked[slotDate] = [];
  slots_booked[slotDate].push(slotTime);

  const userData = await userModel
    .findById(userId)
    .select("-password -refreshToken");

  // Remove slots_booked before storing in appointment snapshot
  const docDataSnapshot = docData.toObject();
  delete docDataSnapshot.slots_booked;

  const appointment = await appointmentModel.create({
    userId,
    docId,
    userData,
    docData: docDataSnapshot,
    amount: docData.fees,
    slotTime,
    slotDate,
    date: Date.now(),
  });

  await doctorModel.findByIdAndUpdate(docId, { slots_booked });

  return res
    .status(201)
    .json(new ApiResponse(201, appointment, "Appointment booked successfully"));
});

// ─── List User Appointments ───────────────────────────────────────────────────
const listAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentModel.find({ userId: req.user._id });
  return res
    .status(200)
    .json(
      new ApiResponse(200, appointments, "Appointments fetched successfully"),
    );
});

// ─── Cancel Appointment ───────────────────────────────────────────────────────
const cancelAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;
  const userId = req.user._id.toString();

  const appointmentData = await appointmentModel.findById(appointmentId);
  // Bug 2 fix: null check before accessing .userId
  if (!appointmentData) {
    throw new ApiError(404, "Appointment not found");
  }
  // Ownership check FIRST — prevents leaking cancellation state to a user
  // who has no business knowing this appointment's status
  if (appointmentData.userId.toString() !== userId) {
    throw new ApiError(403, "Unauthorized action");
  }
  // Bug 3 fix: prevent redundant slot-release on already-cancelled appointments
  if (appointmentData.cancelled) {
    throw new ApiError(400, "Appointment already cancelled");
  }

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
    .json(new ApiResponse(200, {}, "Appointment cancelled successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
};
