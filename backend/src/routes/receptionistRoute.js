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
  generatedTokens,
  cancelTokenAndAppoinment,
  appoinmentsAndPrescriptions,
  generateBill,
  getAllBilling,
  getDashboardData,
  recepLogout,
} from "../controllers/receptionist/recepDutiesController.js";
import verifyReceptionistToken from "../middlewares/verifyReceptionistToken.js";
const receptionistRoute = express.Router();

// Receptionist auth routes
receptionistRoute.post("/auth/recep-login", login);
receptionistRoute.post("/auth/getOtp", ForgotPasswordGetOtp);
receptionistRoute.post("/auth/verifyOtp", verifyOtp);
receptionistRoute.post("/auth/newPassword", newPassword);
receptionistRoute.post("/getDetails", getRecepDetails);

// Receptionist duties routes
receptionistRoute.get(
  "/unApprovedDoctors",
  verifyReceptionistToken,
  unApprovedDoctors
);
receptionistRoute.put(
  "/approveDoctor/:doctorId",
  verifyReceptionistToken,
  approveDoctors
);
receptionistRoute.post(
  "/registerPatient",
  verifyReceptionistToken,
  registerPatient
);
receptionistRoute.get("/getPatients", verifyReceptionistToken, patientDetails);
receptionistRoute.get("/getdoctors", verifyReceptionistToken, doctorDetails);
receptionistRoute.post(
  "/doctorAppoinment",
  verifyReceptionistToken,
  AppoinmentGenerte
);
receptionistRoute.get(
  "/getPatientListAndAppoinments",
  verifyReceptionistToken,
  getAppoinmentAndPatientList
);
receptionistRoute.get(
  "/generateToken/pendingAppointments",
  verifyReceptionistToken,
  pendingAppoinments
);
receptionistRoute.post(
  "/generateToken",
  verifyReceptionistToken,
  generateToken
);
receptionistRoute.get(
  "/getGeneratedTokens",
  verifyReceptionistToken,
  generatedTokens
);
receptionistRoute.post(
  "/cancelToken",
  verifyReceptionistToken,
  cancelTokenAndAppoinment
);
receptionistRoute.get(
  "/getAppoinments/prescriptions",
  verifyReceptionistToken,
  appoinmentsAndPrescriptions
);
receptionistRoute.post(
  "/generateBilling/:PrescriptionId",
  verifyReceptionistToken,
  generateBill
);
receptionistRoute.get("/allBilling", verifyReceptionistToken, getAllBilling);
receptionistRoute.get(
  "/getDashboardData",
  verifyReceptionistToken,
  getDashboardData
);
receptionistRoute.post("/logout",verifyReceptionistToken,recepLogout)

export default receptionistRoute;
