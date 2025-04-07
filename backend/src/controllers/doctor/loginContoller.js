import Doctor from "../../models/doctorSchema.js";
import hashPassword from "../../helpers/bcryptPassword.js";
import jwt from "jsonwebtoken";
import { verifyToken, generateToken } from "../../helpers/jwtToken.js";
import generateOTP from "../../utils/otpGenerator.js";
import sendOtpEmail from "../../utils/sendEmail.js";
import client from "../../helpers/redis.js";

export const login = async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;
    console.log(email, password);
    const hashedPassword = await hashPassword(password);
    if (!hashPassword) {
      return res
        .status(200)
        .json({ success: false, message: "server error try again later" });
    }
    const findUser = await Doctor.findOne({
      isBlocked: false,
      password: hashedPassword,
      email: email,
    });
    if (!findUser) {
      return res
        .status(200)
        .json({ success: false, message: "couldint find account try again" });
    }
    const userPayload = {
      id: findUser._id,
      isDoctor: findUser.isDoctor,
      isAdmin: findUser.isAdmin,
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
      return res
        .status(200)
        .json({
          success: false,
          message: "couldint find user with this email",
        });
    }
    const otp = generateOTP();
    if (!otp) {
      return res
        .status(200)
        .json({
          success: false,
          message: "error in server side try again later",
        });
    }
    console.log("OTP: ", otp);

    const sendMail = await sendOtpEmail(email, otp);
    if (!sendMail) {
      return res
        .status(200)
        .json({
          success: false,
          message: "error in server side try again later",
        });
    }

    const storeOtpRedis = await client.set(`otp:${email}`, otp, { EX: 300 });
    if (!storeOtpRedis) {
      return res
        .status(200)
        .json({
          success: false,
          message: "error in server side try again later",
        });
    }

    return res
      .status(200)
      .json({
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
    const findUser=await Doctor.findOne({email:email})
    if (!findUser) {
      return res
        .status(200)
        .json({ success: false, message: "couldint find user with this email" });
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

    return res
      .status(200)
      .json({ success: true, message: "please Enter a new password",userId:findUser._id });

  } catch (error) {
    console.log("error in verifyOtp receptionist login", error);

    res
      .status(500)
      .json({ success: false, message: "server error try again later" });
  }
};


export const newpassword=async(req,res)=>{
   try {
    
    
         const { newPassword, userId } = req.body;
         
      if (!newPassword && !userId) {
        return res
          .status(200)
          .json({ success: false, message: "please enter newpassword" });
      }
      const findUser = await Doctor.findById(userId);
      if (!findUser) {
        return res
          .status(200)
          .json({
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
}