import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const doctorSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  image:       { type: String, required: true },
  speciality:  { type: String, required: true },
  degree:      { type: String, required: true },
  experience:  { type: String, required: true },
  about:       { type: String, required: true },
  available:   { type: Boolean, default: true },
  fees:        { type: Number, required: true },
  address:     { type: Object, required: true },
  date:        { type: Number, required: true },
  slots_booked: { type: Object, default: {}, minimize: false },
  refreshToken: { type: String }   // stores doctor's current valid refresh token
}, { timestamps: true })

doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

doctorSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// Payload includes role: "DOCTOR" — same shape as user tokens
doctorSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: "DOCTOR" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  )
}

doctorSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, role: "DOCTOR" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  )
}

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema)
export default doctorModel
