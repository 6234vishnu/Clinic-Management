import express from 'express'
import { login,ForgotPasswordGetOtp,verifyOtp,newPassword,getRecepDetails} from '../controllers/receptionist/loginController.js'
import {unApprovedDoctors} from '../controllers/receptionist/recepDutiesController.js'
const receptionistRoute=express.Router()



// Receptionist auth routes
receptionistRoute.post('/auth/recep-login',login)
receptionistRoute.post("/auth/getOtp",ForgotPasswordGetOtp)
receptionistRoute.post("/auth/verifyOtp",verifyOtp)
receptionistRoute.post("/auth/newPassword",newPassword)
receptionistRoute.post("/getDetails",getRecepDetails)


// Receptionist duties routes
receptionistRoute.get("/unApprovedDoctors",unApprovedDoctors)


export default receptionistRoute