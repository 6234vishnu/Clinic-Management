import express from 'express'
import { login,ForgotPasswordGetOtp,verifyOtp,newpassword,signupDoctor } from '../controllers/doctor/loginContoller.js'
import { getpatients,getDocsAppoinments,getPatientsAppoinments,generatePrescriptions,getMedicalRecord } from '../controllers/doctor/navbarController.js'
const doctorRoute=express.Router()

//Doctor Rotues
doctorRoute.post('/auth/doctor-login',login)
doctorRoute.post('/auth/getOtp',ForgotPasswordGetOtp)
doctorRoute.post("/auth/verifyOtp",verifyOtp)
doctorRoute.post("/auth/newPassword",newpassword)
doctorRoute.post("/signup",signupDoctor)

// doctor navbar routes

doctorRoute.get("/getpatients",getpatients)
doctorRoute.get("/appointments",getDocsAppoinments)
doctorRoute.get("/getPatientsAppoinment",getPatientsAppoinments)
doctorRoute.post("/attendAppoinment",generatePrescriptions)
doctorRoute.get("/medicalRecord/:patientId",getMedicalRecord)






export default doctorRoute



