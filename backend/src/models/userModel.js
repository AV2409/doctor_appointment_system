import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image:    { type: String, default: "" },
  address:  { type: Object, default: { line1: "", line2: "" } },
  gender:   { type: String, default: "Not Selected" },
  dob:      { type: String, default: "Not Selected" },
  phone:    { type: String, default: "0000000000" },
  refreshToken: { type: String }   // stores the current valid refresh token
}, { timestamps: true })

// Hash password only when it is modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// Short-lived — used for every API request
// Payload includes role so auth.middleware.js can route to the correct model
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: "USER" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  )
}

// Long-lived — only used to get a new access token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, role: "USER" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  )
}

const userModel = mongoose.models.user || mongoose.model("user", userSchema)
export default userModel
