import React, { useEffect, useState } from 'react';
import api from '../../../services/axios';
import '../../../assets/css/receptionist/totalBillings.css';
import RecepNav from '../partials/recepNav';

const TotalBillingPage = () => {
  const [billings, setBillings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetchBillings();
  }, [currentPage]);

  const fetchBillings = async () => {
    try {
      const response = await api.get(`/receptionist/allBilling?page=${currentPage}&limit=${limit}`);
      if (response.data.success) {
        setBillings(response.data.bills);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
        <RecepNav />
    
    <div className="TotalBillingRecepContainer">
      <h2 className="TotalBillingRecepTitle">All Billing Records</h2>

      <div className="TotalBillingRecepGrid">
        {billings.map((bill) => (
          <div key={bill._id} className="TotalBillingRecepCard">
            <h3 className="TotalBillingRecepPatient">👤 {bill.patient.name}</h3>
            <p>🩺 Doctor: {bill.doctor.name}</p>
            <p>💊 Consultation Fee: ₹{bill.consultationFee}</p>
            <p>➕ Additional Charges: ₹{bill.additionalCharges}</p>
            <p>🎟️ Token Charge: ₹{bill.tokenCharge}</p>
            <p className="TotalBillingRecepTotal">💰 Total: ₹{bill.totalAmount}</p>
            <p>🕒 {new Date(bill.createdAt).toLocaleString()}</p>
            <p className={`TotalBillingRecepStatus ${bill.status}`}>{bill.status}</p>
          </div>
        ))}
      </div>

      <div className="TotalBillingRecepPagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          ⬅ Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next ➡
        </button>
      </div>
    </div>
    </>
  );
};

export default TotalBillingPage;
