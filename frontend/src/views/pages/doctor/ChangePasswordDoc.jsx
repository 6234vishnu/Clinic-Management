import React, { useState } from 'react';
import '../../../assets/css/partials/ChangePassword.css';
import api from '../../../services/axios';

const ChangePasswordDoc = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit =async () => {
    if (!newPassword || !confirmPassword) {
      return setError('Both fields are required.');
    }
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }
  try {
    const docId=localStorage.getItem("docId")
        const response=await api.post('/doctor/auth/newPassword',{newPassword,userId:docId})
        if(response.data.success){
        return  navigate('/')
        }
      return  setError(response.data.message)
      } catch (error) {
        console.log('error in reset password receptionist');
        setError('server error try later');
      }
  };

  return (
    <div className="changePassword-container">
      <div className="changePassword-card">
        <h2 className="changePassword-title">Reset Your Password</h2>
        <p className="changePassword-subtitle">Please enter your new password</p>

        {error && <p className="changePassword-error">{error}</p>}

        <input
          type="password"
          placeholder="New Password"
          className="changePassword-input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="changePassword-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="changePassword-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordDoc;
