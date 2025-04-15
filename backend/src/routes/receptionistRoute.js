import express from "express";
import {
  login,
  ForgotPasswordGetOtp,
  verifyOtp,
  newPassword,
  getRecepDetails,
} from "../controllers/receptionist/loginController.js";
import {
  unApprovedDoctors,
  approveDoctors,
  registerPatient,
  doctorDetails,
  patientDetails,
  AppoinmentGenerte,
  getAppoinmentAndPatientList,
  pendingAppoinments,
  generateToken,
  generatedTokens,cancelTokenAndAppoinment,
  appoinmentsAndPrescriptions,
  generateBill,
  getAllBilling,
  getDashboardData,
} from "../controllers/receptionist/recepDutiesController.js";
const receptionistRoute = express.Router();

// Receptionist auth routes
receptionistRoute.post("/auth/recep-login", login);
receptionistRoute.post("/auth/getOtp", ForgotPasswordGetOtp);
receptionistRoute.post("/auth/verifyOtp", verifyOtp);
receptionistRoute.post("/auth/newPassword", newPassword);
receptionistRoute.post("/getDetails", getRecepDetails);

// Receptionist duties routes
receptionistRoute.get("/unApprovedDoctors", unApprovedDoctors);
receptionistRoute.put("/approveDoctor/:doctorId", approveDoctors);
receptionistRoute.post("/registerPatient", registerPatient);
receptionistRoute.get("/getPatients", patientDetails);
receptionistRoute.get("/getdoctors", doctorDetails);
receptionistRoute.post("/doctorAppoinment", AppoinmentGenerte);
receptionistRoute.get("/getPatientListAndAppoinments",getAppoinmentAndPatientList);
receptionistRoute.get("/generateToken/pendingAppointments", pendingAppoinments);
receptionistRoute.post("/generateToken", generateToken);
receptionistRoute.get("/getGeneratedTokens", generatedTokens);
receptionistRoute.post("/cancelToken", cancelTokenAndAppoinment);
receptionistRoute.get("/getAppoinments/prescriptions", appoinmentsAndPrescriptions);
receptionistRoute.post("/generateBilling/:PrescriptionId", generateBill);
receptionistRoute.get("/allBilling", getAllBilling);
receptionistRoute.get("/getDashboardData", getDashboardData);


export default receptionistRoute;
