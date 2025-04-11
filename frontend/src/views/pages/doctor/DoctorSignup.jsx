import React, { useState } from 'react';
import "../../../assets/css/doctor/doctorSignup.css"
import api from '../../../services/axios';
import { useNavigate } from 'react-router-dom';


const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword:'',
    specialization: '',
    qualification: '',
    experience: '',
    licenseNumber: '',
    licenseDocument: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/doctor/signup', formData);
      if (response.data.success) {
        localStorage.setItem("docId",response.data.user)
        localStorage.getItem("doctorToken",response.data.token)
        navigate('/doctor/login');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log('Signup error:', error);
      setMessage("Server error. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
  
    <div className="adminLoginContainer">
      <div className="adminLoginWrapper">
        <div className="adminLoginLeftPanel">
          <div className="adminLoginIllustration">
            <div className="adminLoginCircle"></div>
            <div className="adminLoginCircleTwo"></div>
            <div className="adminLoginCircleThree"></div>
            <svg className="adminLoginLogoIcon" viewBox="0 0 24 24">
              <image href="\src\assets\images\LogoImage.jpg" x="0" y="0" height="24" width="24" />
            </svg>
          </div>
          <div className="adminLoginWelcomeText">
            <h1>ClinicCare</h1>
            <p>Healthcare Management System</p>
          </div>
        </div>

        <div className="adminLoginRightPanel">
          <div className="adminLoginFormContainer">
            <h2 className="adminLoginTitle">Doctor Signup</h2>
            <form onSubmit={handleSubmit} className="adminLoginForm">
              {[
                { label: 'Full Name', name: 'name', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Phone', name: 'phone', type: 'text' },
                { label: 'Password', name: 'password', type: 'password' },
                { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
                { label: 'Specialization', name: 'specialization', type: 'text' },
                { label: 'Qualification', name: 'qualification', type: 'text' },
                { label: 'Experience (Years)', name: 'experience', type: 'number' },
                { label: 'License Number', name: 'licenseNumber', type: 'text' },
                { label: 'License Document URL', name: 'licenseDocument', type: 'text' }
              ].map((input) => (
                <div className="adminLoginInputGroup" key={input.name}>
                  <label className="adminLoginLabel">{input.label}</label>
                  <input
                    type={input.type}
                    name={input.name}
                    className="adminLoginInput"
                    placeholder={input.label}
                    value={formData[input.name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              <button 
                type="submit" 
                className={`adminLoginButton ${isLoading ? 'adminLoginButtonLoading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
                {isLoading && <span className="adminLoginSpinner"></span>}
              </button>
            </form>
            <h5 style={{color:"red"}}>{message}</h5>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DoctorSignup;
