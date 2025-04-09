import mongoose from "mongoose";
const tokenSchema = new mongoose.Schema({
    tokenNumber: { type: Number, required: true, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    status: { type: String, enum: ["Waiting", "Consulting", "Completed"], default: "Waiting" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Token", tokenSchema);
