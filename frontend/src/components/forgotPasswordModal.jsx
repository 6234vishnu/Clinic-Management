import React, { useState } from "react";
import "../assets/css/partials/ForgotPasswordModal.css";
import api from "../services/axios";
import OtpModal from "./enterOtpModal";

const ForgotPasswordModal = ({ show, onClose, role }) => {
  if (!show) return null;
  const [email, setEmail] = useState(null);
  const [message, setMessage] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);

  const handleClick = async () => {
    if (email === null) {
      return setMessage("Please enter your EMAIL ");
    }

    if (role === "doctor") {
      try {
        const response = await api.post("/doctor/auth/getOtp", { email });
        if (response.data.success) {
          return setShowOTPModal(true);
        }
        return setMessage(response.data.message);
      } catch (error) {
        console.log("error in forgotPassword Modal", error);
        return setMessage("server error");
      }
    }
    if (role === "receptionist") {
      try {
        const response = await api.post("/receptionist/auth/getOtp", { email });
        if (response.data.success) {
          return setShowOTPModal(true);
        }
        return setMessage(response.data.message);
      } catch (error) {
        console.log("error in forgotPassword Modal");
        return setMessage("server error");
      }
    }
  };

  return (
    <>
      <div className="forgotPasswordModal-overlay">
        <div className="forgotPasswordModal-container">
          <div className="forgotPasswordModal-content">
            <h6 style={{ color: "red" }}>{message}</h6>
            <div className="forgotPasswordModal-header">
              <h5 className="forgotPasswordModal-title">Reset Password</h5>
              <button
                className="forgotPasswordModal-close-btn"
                onClick={onClose}
              >
                &times;
              </button>
            </div>
            <div className="forgotPasswordModal-body">
              <p>Enter your email to reset password</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="forgotPasswordModal-input"
                placeholder="Email"
                required
              />
            </div>
            <div className="forgotPasswordModal-footer">
              <button className="forgotPasswordModal-close" onClick={onClose}>
                Close
              </button>
              <button
                onClick={handleClick}
                className="forgotPasswordModal-submit"
              >
                Send OTP to Email
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <OtpModal
          show={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          activeRole={role}
          email={email}
        />
      </div>
    </>
  );
};

export default ForgotPasswordModal;
