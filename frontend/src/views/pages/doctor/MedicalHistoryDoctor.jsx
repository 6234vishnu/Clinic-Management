// MedicalHistoryDoctor.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../assets/css/doctor/MedicalHistoryDoctor.css'
import DoctorNav from '../partials/DoctorNav';
import api from '../../../services/axios';

const MedicalHistoryDoctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const doctorId=localStorage.getItem("docId")
  if(!doctorId) return <h1>Login first to do further</h1>

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get(`/doctor/appointments?docId=${doctorId}`); 
       if(res.data.success){
        console.log(res.data.appoinments);
        
        setAppointments(res.data.appointments);
       }
       setMessage(res.data.message)
      } catch (err) {
        console.error('Error fetching appointments in MedicalHistoryDoctor:', err);
        setMessage('server error')
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
  <>
  <DoctorNav/>
    <div className="medicalHistoryDoc__container">
      <h1 style={{color:"white"}} className="medicalHistoryDoc__title">Medical History</h1>
      <h6 style={{color:"white"}} >{message}</h6>
      <div className="medicalHistoryDoc__searchBar">
  <input
    type="text"
    placeholder="Search by patient name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="medicalHistoryDoc__searchInput"
  />
</div>

{loading ? (
  <div className="medicalHistoryDoc__loading">Loading...</div>
) : (
  <div className="medicalHistoryDoc__grid">
    {appointments &&
      appointments
        .filter((appointment) =>
          appointment.patient.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((appointment) => (
          <div key={appointment._id} className="medicalHistoryDoc__card">
            <div className="medicalHistoryDoc__top">
              <h3 className="medicalHistoryDoc__patient">
                {appointment.patient.name}
              </h3>
              <span className={`medicalHistoryDoc__status medicalHistoryDoc__status--${appointment.status.toLowerCase()}`}>
                {appointment.status}
              </span>
            </div>
            <div className="medicalHistoryDoc__info">
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
              <p><strong>Time Slot:</strong> {appointment.timeSlot}</p>
              {appointment.prescription ? (
                <>
                  <p><strong>Prescription:</strong> ✅ Provided</p>
                  <ul className="medicalHistoryDoc__medicineList">
                    {appointment.prescription.medicines.map((med, index) => (
                      <li key={med._id || index} className="medicalHistoryDoc__medicineItem">
                        <p><strong>Name:</strong> {med.name}</p>
                        <p><strong>Dosage:</strong> {med.dosage}</p>
                        <p><strong>Frequency:</strong> {med.frequency}</p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p><strong>Prescription:</strong> ❌ Not Provided</p>
              )}
            </div>
          </div>
        ))}
  </div>
)}
    </div>
    </>
  );
};

export default MedicalHistoryDoctor;
