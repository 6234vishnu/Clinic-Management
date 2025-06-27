import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  phone: { type: String, required: true },
  address: { type: String },
  medicalHistory: [
    { type: mongoose.Schema.Types.ObjectId, ref: "MedicalRecord" },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Patient", patientSchema);
