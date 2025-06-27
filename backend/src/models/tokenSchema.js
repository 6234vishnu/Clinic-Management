import mongoose from "mongoose";
const tokenSchema = new mongoose.Schema({
  tokenNumber: { type: Number, required: true },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  appoinmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  status: {
    type: String,
    enum: ["Waiting", "Consulting", "Completed", "Cancelled"],
    default: "Waiting",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Token", tokenSchema);
