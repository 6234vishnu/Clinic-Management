import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    qualification: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    licenseDocument: {
      type: String, // store URL if using Cloudinary/S3
      required: true,
    },

    isDoctor: {
      type: Boolean,
      default: true,

    },

    isApproved: {
      type: Boolean,
      default: false, // receptionist sets this to true after verification
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", doctorSchema);
