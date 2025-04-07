import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Appointment", appointmentSchema);
