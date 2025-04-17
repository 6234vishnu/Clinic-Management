import Doctor from "../../models/doctorSchema.js";
import hashPassword from "../../helpers/bcryptPassword.js";
import { generateToken } from "../../helpers/jwtToken.js";
import generateOTP from "../../utils/otpGenerator.js";
import sendOtpEmail from "../../utils/sendEmail.js";
import client from "../../helpers/redis.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body.formData;

    const findUser = await Doctor.findOne({
      isBlocked: false,
      isApproved: true,
      email: email,
    });
    if (!findUser) {
      return res
        .status(200)
        .json({ success: false, message: "couldint find account try again" });
    }
    const hashedPassword = await bcrypt.compare(password, findUser.password);
    if (!hashedPassword) {
      return res
        .status(200)
        .json({ success: false, message: "server error try again later" });
    }
    const userPayload = {
      id: findUser._id,
    };
    const token = generateToken(userPayload);
    if (!token) {
      return res
        .status(200)
        .json({ success: false, message: "server error try again later" });
    }
    res.cookie("authTokenDoc", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    });

    return res
      .status(200)
      .json({ success: true, message: "success", token, user: userPayload.id });
  } catch (error) {
    console.log("error in doctor login", error);

    res
      .status(500)
      .json({ success: false, message: "server error try again later" });
  }
};

export const ForgotPasswordGetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await Doctor.findOne({ email: email, isBlocked: false });
    if (!findUser) {
      return res.status(200).json({
        success: false,
        message: "couldint find user with this email",
      });
    }
    const otp = generateOTP();
    if (!otp) {
      return res.status(200).json({
        success: false,
        message: "error in server side try again later",
      });
    }
    console.log("OTP: ", otp);

    const sendMail = await sendOtpEmail(email, otp);
    if (!sendMail) {
      return res.status(200).json({
        success: false,
        message: "error in server side try again later",
      });
    }

    const storeOtpRedis = await client.set(`otp:${email}`, otp, { EX: 300 });
    if (!storeOtpRedis) {
      return res.status(200).json({
        success: false,
        message: "error in server side try again later",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Otp is send to your Email please check",
    });
  } catch (error) {
    console.log("error in ForgotPasswordGetOtp receptionist", error);

    res
      .status(500)
      .json({ success: false, message: "server error try again later" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const findUser = await Doctor.findOne({ email: email });
    if (!findUser) {
      return res.status(200).json({
        success: false,
        message: "couldint find user with this email",
      });
    }

    const storedOtp = await client.get(`otp:${email}`);

    if (!otp) {
      return res
        .status(200)
        .json({ success: false, message: "please enter the otp" });
    }
    if (otp !== storedOtp) {
      return res.status(200).json({ success: false, message: "Invalid OTP" });
    }

    return res.status(200).json({
      success: true,
      message: "please Enter a new password",
      userId: findUser._id,
    });
  } catch (error) {
    console.log("error in verifyOtp receptionist login", error);

    res
      .status(500)
      .json({ success: false, message: "server error try again later" });
  }
};

export const newpassword = async (req, res) => {
  try {
    const { newPassword, userId } = req.body;

    if (!newPassword && !userId) {
      return res
        .status(200)
        .json({ success: false, message: "please enter newpassword" });
    }
    const findUser = await Doctor.findById(userId);
    if (!findUser) {
      return res.status(200).json({
        success: false,
        message: "couldint find user with this Email ID",
      });
    }

    const updatepassword = await Doctor.findByIdAndUpdate(
      findUser._id,
      { set: { password: newPassword } },
      { new: true }
    );
    if (!updatepassword) {
      return res
        .status(200)
        .json({ success: false, message: "coulint update password try later" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("error in new password receptionist login", error);
    res
      .status(500)
      .json({ success: false, message: "server error try again later" });
  }
};
export const signupDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      specialization,
      qualification,
      experience,
      licenseNumber,
      licenseDocument,
      confirmPassword,
    } = req.body;

    if (
      !name &&
      !email &&
      !phone &&
      !password &&
      !specialization &&
      !qualification &&
      !experience &&
      !licenseNumber &&
      !licenseDocument &&
      !confirmPassword
    ) {
      return res
        .status(200)
        .json({ success: false, message: "fill all the feilds to signup" });
    }
    const findUser = await Doctor.findOne({ email: email });

    if (findUser) {
      return res
        .status(200)
        .json({
          success: false,
          message: "user already exists with same email",
        });
    }

    if (password !== confirmPassword) {
      return res
        .status(200)
        .json({
          success: false,
          message: "password and confirm password are not matched",
        });
    }
    const hashedPassword = await hashPassword(password);

    const newDoctor = new Doctor({
      name,
      email,
      phone,
      password: hashedPassword,
      specialization,
      qualification,
      experience,
      licenseNumber,
      licenseDocument,
    });

    const saveDoctor = await newDoctor.save();

    if (!saveDoctor) {
      return res
        .status(200)
        .json({ success: false, message: "server error try again later" });
    }

    const userPayload = {
      id: saveDoctor._id,
      isDoctor: saveDoctor.isDoctor,
    };
    const token = generateToken(userPayload);
    if (!token) {
      return res
        .status(200)
        .json({ success: false, message: "server error try again later" });
    }
    res.cookie("authTokenDoc", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    });

    return res
      .status(200)
      .json({ success: true, message: "success", token, user: userPayload.id });
  } catch (error) {
    console.log("error in doctor signUp", error);
    res
      .status(500)
      .json({ success: false, message: "server error try again later" });
  }
};
