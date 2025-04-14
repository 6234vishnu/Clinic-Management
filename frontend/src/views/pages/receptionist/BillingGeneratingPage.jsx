import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/css/receptionist/BillingGeneratePage.css';
import api from '../../../services/axios';

const BillingGeneratingPage = () => {
    const location=useLocation()
    const PrescriptionId=location.state?.PrescriptionId;
    if(!PrescriptionId) return <h1>Couldint find any appoinments</h1>

  const [formData, setFormData] = useState({

    consultationFee: '',
    additionalCharges: '',
    totalAmount: '',
  });
  const [message,setmessage]=useState("")
  const [uploadedBill,setUploadedBill]=useState([])

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

  
    if (name === 'consultationFee' || name === 'additionalCharges') {
      const consultationFee = parseFloat(updatedData.consultationFee || 0);
      const additionalCharges = parseFloat(updatedData.additionalCharges || 0);
      updatedData.totalAmount = consultationFee + additionalCharges;
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.additionalCharges&& !formData.consultationFee) return setmessage('fill the feilds before the submission')
    try {
     
      const response=await api.post(`/receptionist/generateBilling/${PrescriptionId}`,{formData})
      if(response.data.success){
        setUploadedBill(response.data.billing)
      }
      setmessage(response.data.message)
    } catch (error) {
      console.error('Billing error:', error);
      alert('Something went wrong while generating bill.');
    }
  };

  return (
    <>
    
    <div className="BillingGenarationRecepContainer">
      <form className="BillingGenarationRecepForm" onSubmit={handleSubmit}>
        <h2 className="BillingGenarationRecepTitle">Generate Bill</h2>
         <h5 style={{color:"red"}}>{message}</h5>
     <label htmlFor="consultationFee"> consultation Fee :</label>
        <input
          type="number"
          name="consultationFee"
          placeholder="Consultation Fee"
          className="BillingGenarationRecepInput"
          value={formData.consultationFee}
          onChange={handleChange}
          required
        />
<label htmlFor="additional Charges">additional Charges :</label>
        <input
          type="number"
          name="additionalCharges"
          placeholder="Additional Charges"
          className="BillingGenarationRecepInput"
          value={formData.additionalCharges}
          onChange={handleChange}
          required
        />
<label htmlFor="totalAmount">totalAmount :</label>
        <input
          type="number"
          name="totalAmount"
          className="BillingGenarationRecepInput"
          value={formData.totalAmount}
          readOnly
        />
        <h6 style={{color:"green"}}><strong>Note: </strong>If this  is the first appoinment token fee <strong>₹100</strong> will be added</h6>

        <button type="submit" className="BillingGenarationRecepButton">
          Submit Bill
        </button>
      </form>
    </div>

    {uploadedBill && uploadedBill._id && (
  <div className="BillingGenarationRecepModalOverlay">
    <div className="BillingGenarationRecepModal">
      <h2 className="BillingGenarationRecepModalTitle">Billing Details</h2>
      <p><strong>Patient Name</strong> {uploadedBill.patient.name}</p>
      <p><strong>Consultation Fee:</strong> ₹{uploadedBill.consultationFee}</p>
      <p><strong>Additional Charges:</strong> ₹{uploadedBill.additionalCharges}</p>
      <p><strong>Total Amount:</strong> ₹{uploadedBill.totalAmount}</p>
      <p><strong>Date:</strong> {new Date(uploadedBill.createdAt).toLocaleString()}</p>
      <h6 style={{color:"green"}}><strong>Note: </strong>If this  is the first appoinment token fee <strong>₹100</strong> will be added</h6>
      <button
        className="BillingGenarationRecepModalCloseButton"
        onClick={() => setUploadedBill([])}
      >
        Close
      </button>
    </div>
  </div>
)}
    </>
  );
};

export default BillingGeneratingPage;
