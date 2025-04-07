import mongoose from "mongoose";
const prescriptionSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    medicines: [
        {
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true }
        }
    ],
    instructions: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Prescription", prescriptionSchema);
