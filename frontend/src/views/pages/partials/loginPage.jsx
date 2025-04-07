import React, { useState } from "react";
import "../../../assets/css/partials/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserMd,
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import api from '../../../services/axios'
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from '../../../components/forgotPasswordModal'


const LoginPage = () => {
  const [activeRole, setActiveRole] = useState("doctor");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
 
  const [message,setMessage]=useState("")
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formAnimation, setFormAnimation] = useState(false);

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setFormAnimation(true);
    setTimeout(() => setFormAnimation(false), 500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();

    // console.log(`Logging in as ${activeRole} with:`, formData);
  if(activeRole==="doctor"){
    try {
    
        const response=await api.post("/doctor/auth/doctor-login",{formData})
        if(response.data.success){
          localStorage.setItem("docId",response.data.user)
          localStorage.getItem("doctorToken",response.data.token)
          return navigate("/Doctor-Dashboard")
        }
       return setMessage(response.data.message)
    } catch (error) {
        setMessage("server error try again later")
    return  console.log('error in loginPage',error);
        
    }
  }
  if(activeRole==="receptionist"){
    try {
       
        const response=await api.post("/receptionist/auth/recep-login",{formData})
        if(response.data.success){
          localStorage.setItem("recepId",response.data.user)
          localStorage.getItem("recepionistToken",response.data.token);
          return navigate("/receptionist-Dashboard")
        }
       return setMessage(response.data.message)
    } catch (error) {
        setMessage("server error try again later")
        return  console.log('error in loginPage',error);
    }
  }
  };

  return (
    <>
    <div className="loginPage-container" style={{ display: "flex" }}>
      <div>
        <img
          style={{
            width: "300px",
            height: "230px",
            padding: "30px",
            borderRadius: "59px",
          }}
          src="\src\assets\images\LogoImage.jpg"
          alt="Clinic Logo"
        />
      </div>
      <div className="loginPage-card">
        <div className="loginPage-header">
          <img
            className="loginPage-logo"
            src="\src\assets\images\LogoImage.jpg"
            alt="Hospital Logo"
          />
          <div className="loginPage-help">
          <h5 style={{color:"red",paddingBottom:"10px"}}>{message}</h5>
        </div>
          <h1 className="loginPage-title">Medical Staff Portal</h1>
        </div>

        <div className="loginPage-toggle-container">
          <button
            className={`loginPage-toggle-btn ${
              activeRole === "doctor" ? "active" : ""
            }`}
            onClick={() => handleRoleChange("doctor")}
          >
            <FontAwesomeIcon icon={faUserMd} /> Doctor
          </button>
          <button
            className={`loginPage-toggle-btn ${
              activeRole === "receptionist" ? "active" : ""
            }`}
            onClick={() => handleRoleChange("receptionist")}
          >
            <FontAwesomeIcon icon={faUser} /> Receptionist
          </button>
        </div>
        {activeRole === "receptionist" && (
  <div style={{ marginTop: "10px", color: "#555", fontSize: "14px", textAlign: "center" }}>
    <em style={{color:"green"}}><strong style={{color:"black"}}>Note:</strong> if your logging in for the first time or dont know the password select forgot password to complete your login.</em>
  </div>
)}

        <div className="loginPage-role-indicator">
          <span className="loginPage-role-text">
            {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Login
          </span>
        </div>

        <form
          className={`loginPage-form ${
            formAnimation ? "loginPage-form-change" : ""
          }`}
          onSubmit={handleSubmit}
        >
          <div className="loginPage-input-group">
            <label htmlFor="email" className="loginPage-label">
              Email
            </label>
            <div className="loginPage-input-container">
              <FontAwesomeIcon icon={faEnvelope} className="loginPage-icon" />
              <input
                type="email"
                id="email"
                name="email"
                className="loginPage-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="loginPage-input-group">
            <label htmlFor="password" className="loginPage-label">
              Password
            </label>
            <div className="loginPage-input-container">
              <FontAwesomeIcon icon={faLock} className="loginPage-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="loginPage-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="loginPage-password-toggle"
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>

          <div className="loginPage-options">
            <a href="#" className="loginPage-forgot" onClick={()=>setShowModal(true)}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className="loginPage-submit-btn">
            <span className="loginPage-btn-text">Login</span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="loginPage-btn-icon"
            />
          </button>
        </form>

        
      </div>
      <ForgotPasswordModal  show={showModal} onClose={() => setShowModal(false)} role={activeRole} />
    </div>
    
    </>
  );
};

export default LoginPage;
