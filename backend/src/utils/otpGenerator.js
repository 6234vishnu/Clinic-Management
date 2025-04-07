// utils/generateOtp.js
import otpGenerator from 'otp-generator';

 const generateOTP = (length = 6) => {
  
        let otp = '';
        for (let i = 0; i < length; i++) {
          otp += Math.floor(Math.random() * 10); // Appends a digit (0-9)
        }
        return otp;
      
};

export default generateOTP