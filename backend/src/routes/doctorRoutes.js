import express from "express";
import {
  login,
  ForgotPasswordGetOtp,
  verifyOtp,
  newpassword,
  signupDoctor,
} from "../controllers/doctor/loginContoller.js";
import verifyDoctorToken from "../middlewares/verifyDoctorToken.js";
import {
  getpatients,
  getDocsAppoinments,
  getPatientsAppoinments,
  generatePrescriptions,
  getMedicalRecord,
  DashboardData,
  getDoctorDetails,
} from "../controllers/doctor/navbarController.js";
const doctorRoute = express.Router();

//Doctor Rotues
doctorRoute.post("/auth/doctor-login", login);
doctorRoute.post("/auth/getOtp", ForgotPasswordGetOtp);
doctorRoute.post("/auth/verifyOtp", verifyOtp);
doctorRoute.post("/auth/newPassword", newpassword);
doctorRoute.post("/signup", signupDoctor);

// doctor navbar routes

doctorRoute.get("/getpatients",verifyDoctorToken, getpatients);
doctorRoute.post("/getDetails",verifyDoctorToken, getDoctorDetails);
doctorRoute.get("/appointments",verifyDoctorToken, getDocsAppoinments);
doctorRoute.get("/getPatientsAppoinment",verifyDoctorToken, getPatientsAppoinments);
doctorRoute.post("/attendAppoinment",verifyDoctorToken, generatePrescriptions);
doctorRoute.get("/medicalRecord/:patientId",verifyDoctorToken, getMedicalRecord);
doctorRoute.get("/dashboardData",verifyDoctorToken, DashboardData);

export default doctorRoute;
