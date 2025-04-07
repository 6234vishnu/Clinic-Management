import express from 'express'
import { login,ForgotPasswordGetOtp ,verifyOtp,newPassword} from '../controllers/receptionist/loginController.js'
const receptionistRoute=express.Router()



// Receptionist routes
receptionistRoute.post('/auth/recep-login',login)
receptionistRoute.post("/auth/getOtp",ForgotPasswordGetOtp)
receptionistRoute.post("/auth/verifyOtp",verifyOtp)
receptionistRoute.post("/auth/newPassword",newPassword)

export default receptionistRoute