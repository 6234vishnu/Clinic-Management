import express from 'express'
import { login,ForgotPasswordGetOtp,verifyOtp,newpassword } from '../controllers/doctor/loginContoller.js'
const doctorRoute=express.Router()

//Doctor Rotues
doctorRoute.post('/auth/doctor-login',login)
doctorRoute.post('/auth/getOtp',ForgotPasswordGetOtp)
doctorRoute.post("/auth/verifyOtp",verifyOtp)
doctorRoute.post("/auth/newPassword",newpassword)


export default doctorRoute



