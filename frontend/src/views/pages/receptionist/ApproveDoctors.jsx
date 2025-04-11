import React, { useEffect, useState } from 'react';
import { X, Check, Calendar, Shield, Award, Briefcase, AlertCircle } from 'lucide-react';
import '../../../assets/css/receptionist/ApproveDoctors.css';
import api from '../../../services/axios';
import RecepNav from '../partials/recepNav';

const ApproveDoctors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const getDoctor = async () => {
      try {
        setLoading(true);
        const response = await api.get('/receptionist/unApprovedDoctors');
        if (response.data.success) {
            console.log(response.data.doctor);
            
          setDoctors(response.data.doctor);
        } else {
          setMessage(response.data.message || "No doctors pending approval");
        }
      } catch (error) {
        console.log('Error in fetching doctors', error);
        setMessage("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    getDoctor();
  }, []);

  const toggleModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleAccept = async () => {
    if (!selectedDoctor) return;

    try {
      console.log(selectedDoctor._id);
      
      const response = await api.put(`/receptionist/approveDoctor/${selectedDoctor._id}`);
      if (response.data.success) {
        const updatedDoctors = doctors.filter(doc => doc._id !== selectedDoctor._id);
        setDoctors(updatedDoctors);
        setMessage(response.data.message);
        setTimeout(() => {
          setSelectedDoctor(null);
          setIsModalOpen(false);
          setMessage(''); 
        }, 2000);
      }
    } catch (error) {
      console.log('Error approving doctor', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="loadingSpinner"></div>
        <p>Loading doctor information...</p>
      </div>
    );
  }

  if (!doctors.length) {
    return (
      <>
       <RecepNav/>
      <div className="noDoctorstContainer">
        <div className="noDoctorstIcon">
          <AlertCircle size={48} />
        </div>
        <h2 className="noDoctorstTitle">No Doctors to Approve</h2>
        <p className="noDoctorstMessage">{message || "There are currently no doctors pending approval."}</p>
      </div>
      </>
    );
  }

  return (
    <>
    <RecepNav/>
      <div className="doctorCardsContainer">
        {doctors.map((doctor) => (
          <div className="doctorCard" key={doctor._id} onClick={() => toggleModal(doctor)}>
            <div className="doctorLogoContainer">
              <div className="doctorLogo">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="doctorInfo">
              <h3 className="doctorName">{doctor.name}</h3>
              <p className="doctorSpecialty">{doctor.specialization}</p>
            </div>
            <div className="doctorDate">
              <Calendar size={16} />
              <span>{currentDate}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedDoctor && (
        <div className="modalOverlay">
          <div className="modalContent">
            <div className="modalHeader">
              <h2>Doctor Details</h2>
              <button className="closeButton" onClick={handleCancel}>
                <X size={24} />
              </button>
            </div>

            <div className="doctorProfileContainer">
              <div className="doctorProfileHeader">
                <div className="doctorAvatar">
                  {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="doctorHeaderInfo">
                  <h3>{selectedDoctor.name}</h3>
                  <p className="doctorStatus">
                    Status: <span className="statusIndicator pending">Pending Approval</span>
                  </p>
                </div>
              </div>

              <div className="doctorDetailSection">
                <div className="detailGroup">
                  <div className="detailItem">
                    <h4>Contact Information</h4>
                    <p><strong>Email:</strong> {selectedDoctor.email}</p>
                    <p><strong>Phone:</strong> {selectedDoctor.phone}</p>
                  </div>

                  <div className="detailItem">
                    <h4>Professional Details</h4>
                    <div className="iconDetail">
                      <Award size={18} />
                      <p><strong>Qualification:</strong> {selectedDoctor.qualification}</p>
                    </div>
                    <div className="iconDetail">
                      <Briefcase size={18} />
                      <p><strong>Experience:</strong> {selectedDoctor.experience} years</p>
                    </div>
                    <div className="iconDetail">
                      <Shield size={18} />
                      <p><strong>License Number:</strong> {selectedDoctor.licenseNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="documentSection">
                  <h4>License Document</h4>
                  <div className="documentPreview">
                    <a href={selectedDoctor.licenseDocument} target="_blank" rel="noopener noreferrer">
                      View License Document
                    </a>
                  </div>
                </div>

                <div className="dateInfo">
                  <p><strong>Registered on:</strong> {new Date(selectedDoctor.createdAt).toLocaleDateString()}</p>
                  <p><strong>Last Updated:</strong> {new Date(selectedDoctor.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="modalActions">
                <button className="cancelButton" onClick={handleCancel}>Cancel</button>
                <button className="acceptButton" onClick={handleAccept}>
                  Approve Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApproveDoctors;
