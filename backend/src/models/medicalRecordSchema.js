import mongoose from "mongoose";
const medicalRecordSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    diagnosis: { type: String, required: true },
    prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prescription" }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("MedicalRecord", medicalRecordSchema);
