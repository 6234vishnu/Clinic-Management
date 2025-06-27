import mongoose from "mongoose";
const billingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
  consultationFee: { type: Number, required: true },
  additionalCharges: { type: Number, default: 0 },
  tokenCharge: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Billing", billingSchema);
