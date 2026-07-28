import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { razorpayInstance } from "../utils/razorpay.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendBookingEmails,
  sendCancellationEmails,
  sendWelcomeEmail,
  sendPaymentEmails,
} from "../utils/appointmentEmails.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await userModel.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

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

  sendWelcomeEmail(createdUser);

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

  if (decodedToken.role !== "USER") {
    throw new ApiError(401, "Invalid refresh token for this endpoint");
  }

  const user = await userModel.findById(decodedToken?._id);
  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

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

const getProfile = asyncHandler(async (req, res) => {
  const userData = await userModel
    .findById(req.user._id)
    .select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, userData, "Profile fetched successfully"));
});

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

const bookAppointment = asyncHandler(async (req, res) => {
  const { docId, slotDate, slotTime } = req.body;
  const userId = req.user._id;

  const docData = await doctorModel
    .findById(docId)
    .select("-password -refreshToken");

  if (!docData) {
    throw new ApiError(404, "Doctor not found");
  }
  if (!docData.available) {
    throw new ApiError(400, "Doctor is not available");
  }

  const slotArrayPath = `slots_booked.${slotDate}`;

  const claimed = await doctorModel.findOneAndUpdate(
    {
      _id: docId,
      [slotArrayPath]: { $ne: slotTime },
    },
    {
      $push: { [slotArrayPath]: slotTime },
    },
    { new: true },
  );

  if (!claimed) {
    throw new ApiError(
      409,
      "This slot was just booked. Please select another time.",
    );
  }

  const userData = await userModel
    .findById(userId)
    .select("-password -refreshToken");

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

  sendBookingEmails(appointment);

  return res
    .status(201)
    .json(new ApiResponse(201, appointment, "Appointment booked successfully"));
});

const listAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentModel.find({ userId: req.user._id });
  return res
    .status(200)
    .json(
      new ApiResponse(200, appointments, "Appointments fetched successfully"),
    );
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;
  const userId = req.user._id.toString();

  const appointmentData = await appointmentModel.findById(appointmentId);
  if (!appointmentData) {
    throw new ApiError(404, "Appointment not found");
  }
  if (appointmentData.userId.toString() !== userId) {
    throw new ApiError(403, "Unauthorized action");
  }
  if (appointmentData.isCompleted) {
    throw new ApiError(400, "Completed appointments cannot be cancelled");
  }
  if (appointmentData.payment) {
    throw new ApiError(400, "Paid appointments cannot be cancelled");
  }

  const cancelled = await appointmentModel.findOneAndUpdate(
    {
      _id: appointmentId,
      userId: userId,
      cancelled: false,
      isCompleted: false,
      payment: false,
    },
    { cancelled: true },
    { new: true },
  );

  if (!cancelled) {
    throw new ApiError(
      409,
      "Appointment was already cancelled by another request",
    );
  }

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

  sendCancellationEmails(appointmentData, "PATIENT");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Appointment cancelled successfully"));
});

const paymentRazorpay = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;

  const appointment = await appointmentModel.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (appointment.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized action");
  }

  if (appointment.cancelled) {
    throw new ApiError(400, "Appointment cancelled");
  }

  if (appointment.payment) {
    throw new ApiError(400, "Appointment already paid");
  }

  let order;
  try {
    order = await razorpayInstance.orders.create({
      amount: appointment.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointment._id.toString(),
    });
  } catch (rzpErr) {
    const description =
      rzpErr?.error?.description ||
      rzpErr?.message ||
      "Razorpay order creation failed";
    throw new ApiError(502, `Payment gateway error: ${description}`);
  }

  appointment.orderId = order.id;
  await appointment.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        key: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      "Razorpay order created successfully",
    ),
  );
});

const verifyRazorpay = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Missing payment details");
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature");
  }

  const appointment = await appointmentModel.findOne({
    orderId: razorpay_order_id,
  });
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (appointment.payment) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Payment verified successfully"));
  }

  appointment.payment = true;
  appointment.paymentId = razorpay_payment_id;
  await appointment.save({ validateBeforeSave: false });

  sendPaymentEmails(appointment);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Payment verified successfully"));
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
  paymentRazorpay,
  verifyRazorpay,
};
