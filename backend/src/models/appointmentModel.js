import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
  // ObjectId references maintain relationships and support Mongoose populate
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  docId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
    required: true
  },
  slotDate:    { type: String, required: true },
  slotTime:    { type: String, required: true },
  // Snapshot fields — preserve the user/doctor data at the time of booking.
  // These remain accurate even if the user changes their name or the doctor
  // changes their fees after the appointment was created.
  userData:    { type: Object, required: true },
  docData:     { type: Object, required: true },
  amount:      { type: Number, required: true },
  date:        { type: Number, required: true },
  cancelled:   { type: Boolean, default: false },
  payment:     { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
})

// Example populate usage (optional — snapshots cover most cases):
// await appointmentModel.findById(id).populate("userId").populate("docId")

const appointmentModel = mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema)
export default appointmentModel
