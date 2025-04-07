import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/partials/otpModal.css'; // Optional: For custom styling
import api from '../services/axios';
import { set } from 'mongoose';
import { useNavigate } from 'react-router-dom';

const OtpModal = ({ show, onClose,activeRole,email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [message,setMessage]=useState("")
  const navigate=useNavigate()

  if (!show) return null;

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };



  const handleSubmit =async (e) => {
    e.preventDefault()
    const fullOtp = otp.join("");
    if (!fullOtp.length === 6) {
     return setMessage("Enter six digit otp")
        
    } 
    console.log('activeRole',activeRole,email);
    
    if(activeRole==='doctor'){
        try {
            const response=await api.post(`/doctor/auth/verifyOtp`,{otp:fullOtp,email})
            if(response.data.success){
                localStorage.setItem('docId',response.data.userId)
               navigate('/Change-Password-Doctor')
            }
            set(response.data.message)
        } catch (error) {
            console.log('error in otpModal doctor',error);
            setMessage('server error try later')
            
            
        }
    }
    if(activeRole==="receptionist"){
        try {
          
          const response=await api.post(`/receptionist/auth/verifyOtp`,{otp:fullOtp,email})
          if(response.data.success){
            localStorage.setItem('recpId',response.data.userId)
                navigate('/Change-Password-receptionist')
             }
             setMessage(response.data.message)
        } catch (error) {
            console.log('error in otpModal receptionist',error);
            setMessage('server error try later')
        }
    }
  };


  return (
    <div className="otpModal-overlay">
      <div className="otpModal-content">
        <h2>Enter OTP</h2>
        <p>Please enter the 6-digit OTP sent to your email</p>
        <h5 style={{color:"red"}}>{message}</h5>
        <div className="otpModal-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="otpModal-input"
            />
          ))}
        </div>
        <div className="otpModal-actions">
          <button className="otpModal-submit" onClick={handleSubmit}>
            Submit
          </button>
          <button className="otpModal-close" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
