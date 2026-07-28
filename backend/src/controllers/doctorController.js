import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import { sendCancellationEmails } from "../utils/appointmentEmails.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const generateAccessAndRefreshTokens = async (doctorId) => {
  const doctor = await doctorModel.findById(doctorId);
  const accessToken = doctor.generateAccessToken();
  const refreshToken = doctor.generateRefreshToken();

  doctor.refreshToken = refreshToken;
  await doctor.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const doctorList = asyncHandler(async (req, res) => {
  const doctors = await doctorModel
    .find({})
    .select("-password -email -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, doctors, "Doctors fetched successfully"));
});

const loginDoctor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const doctor = await doctorModel.findOne({ email });
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  const isPasswordValid = await doctor.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    doctor._id,
  );
  const loggedInDoctor = await doctorModel
    .findById(doctor._id)
    .select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { doctor: loggedInDoctor, accessToken, refreshToken },
        "Login successful",
      ),
    );
});

const logoutDoctor = asyncHandler(async (req, res) => {
  await doctorModel.findByIdAndUpdate(
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

const refreshDoctorAccessToken = asyncHandler(async (req, res) => {
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

  if (decodedToken.role !== "DOCTOR") {
    throw new ApiError(401, "Invalid refresh token for this endpoint");
  }

  const doctor = await doctorModel.findById(decodedToken?._id);
  if (!doctor) throw new ApiError(401, "Invalid refresh token");

  if (incomingRefreshToken !== doctor.refreshToken) {
    throw new ApiError(
      401,
      "Refresh token is expired or has already been used",
    );
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(doctor._id);

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

const changeAvailablity = asyncHandler(async (req, res) => {
  let { docId } = req.body;

  if (req.user.role === "DOCTOR") {
    docId = req.user._id;
  }

  const docData = await doctorModel.findById(docId);
  if (!docData) throw new ApiError(404, "Doctor not found");

  await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
  return res.status(200).json(new ApiResponse(200, {}, "Availability updated"));
});

const appointmentsDoctor = asyncHandler(async (req, res) => {
  const appointments = await appointmentModel.find({ docId: req.user._id });
  return res
    .status(200)
    .json(
      new ApiResponse(200, appointments, "Appointments fetched successfully"),
    );
});

const appointmentComplete = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;
  const docId = req.user._id.toString();

  const appointmentData = await appointmentModel.findById(appointmentId);
  if (!appointmentData) {
    throw new ApiError(404, "Appointment not found");
  }
  if (appointmentData.docId.toString() !== docId) {
    throw new ApiError(403, "Unauthorized action");
  }
  if (appointmentData.cancelled) {
    throw new ApiError(400, "Cancelled appointments cannot be completed");
  }
  if (appointmentData.isCompleted) {
    throw new ApiError(400, "Appointment already completed");
  }

  await appointmentModel.findByIdAndUpdate(appointmentId, {
    isCompleted: true,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Appointment marked as completed"));
});

const appointmentCancel = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;
  const docId = req.user._id.toString();

  const appointmentData = await appointmentModel.findById(appointmentId);
  if (!appointmentData) {
    throw new ApiError(404, "Appointment not found");
  }
  if (appointmentData.docId.toString() !== docId) {
    throw new ApiError(403, "Unauthorized action");
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

  const { slotDate, slotTime } = appointmentData;
  const docData = await doctorModel.findById(docId);
  if (!docData) {
    throw new ApiError(404, "Doctor not found");
  }
  const slots_booked = docData.slots_booked;
  slots_booked[slotDate] = (slots_booked[slotDate] || []).filter(
    (t) => t !== slotTime,
  );
  await doctorModel.findByIdAndUpdate(docId, { slots_booked });

  sendCancellationEmails(appointmentData, "DOCTOR");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Appointment cancelled"));
});

const doctorDashboard = asyncHandler(async (req, res) => {
  const appointments = await appointmentModel.find({ docId: req.user._id });

  let earnings = 0;
  const patients = [];

  appointments.forEach((item) => {
    if (!item.cancelled && (item.isCompleted || item.payment))
      earnings += item.amount;
    if (!patients.includes(item.userId.toString()))
      patients.push(item.userId.toString());
  });

  const dashData = {
    earnings,
    appointments: appointments.length,
    patients: patients.length,
    latestAppointments: [...appointments]
      .sort((a, b) => b.date - a.date)
      .slice(0, 5),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, dashData, "Dashboard data fetched"));
});

const doctorProfile = asyncHandler(async (req, res) => {
  const profileData = await doctorModel
    .findById(req.user._id)
    .select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, profileData, "Profile fetched successfully"));
});

const updateDoctorProfile = asyncHandler(async (req, res) => {
  const { fees, address, available } = req.body;

  await doctorModel.findByIdAndUpdate(req.user._id, {
    fees,
    address,
    available,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Profile updated successfully"));
});

export {
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
};
