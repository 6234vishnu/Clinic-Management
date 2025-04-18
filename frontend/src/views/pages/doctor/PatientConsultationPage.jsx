import React, { useState, useEffect } from 'react';
import '../../../assets/css/doctor/PatientConsultationPage.css';
import DoctorNav from '../partials/DoctorNav';
import api from '../../../services/axios';

const PatientConsultationPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [token,setToken]=useState(0)
  const [prescription, setPrescription] = useState({
    medicines: [{ name: '', dosage: '', frequency: '' }],
    diagnosis: '',
    instructions: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModal, setActiveModal] = useState(null); 
  
  const patientsPerPage = 3;

const doctorId=localStorage.getItem("docId")
  useEffect(() => {
    const getPatients=async()=>{
try {
    const response=await api.get(`/doctor/getpatients?doctorId=${doctorId}`)
    if(response.data.success){
        setPatients(response.data.patients)
      
        setIsLoading(false)
    }
    setErrorMessage(response.data.message)
} catch (error) {
    console.log('error in getPatients PatientConsultationPage',error);
    setErrorMessage('server error')
    
}
    }

    getPatients()
   
  }, []);

  // Fetch appointment data when a patient is selected
  useEffect(() => {
    if (!selectedPatient) return;
  
    const getAppointments = async () => {
      try {
        const response = await api.get(`/doctor/getPatientsAppoinment?patientId=${selectedPatient._id}`);
        if (response.data.success) {
          setAppointmentData(response.data.appointments[0]);
          setToken(response.data.token)
  
          // Defensive check in case prescription doesn't exist
          if (response.data.appointments?.prescription) {
            setPrescription(response.data.appointments.prescription);
          } else {
            setPrescription({
              medicines: [{ name: '', dosage: '', frequency: '' }],
              instructions: '',
            });
          }
        } else {
          setErrorMessage(response.data.message || 'Failed to fetch appointments');
        }
      } catch (error) {
        console.error('Error in getAppointments PatientConsultationPage', error);
        setErrorMessage('Server error');
      }
    };
  
    // Reset prescription before fetching new data
    setPrescription({
      medicines: [{ name: '', dosage: '', frequency: '' }],
      instructions: '',
    });
  
    getAppointments();
  }, [selectedPatient]);
  

  const handlePatientSelect = (patient) => {
    setErrorMessage("")
    setSuccessMessage("")
    setSelectedPatient(patient);
  };

  const handleAddMedicine = () => {
    setPrescription({
      ...prescription,
      medicines: [...prescription.medicines, { name: '', dosage: '', frequency: '' }],
    });
  };

  const handleDiagnosisChange=(value)=>{
    setPrescription(prev => ({ ...prev, diagnosis: value }));
  }

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = [...prescription.medicines];
    updatedMedicines.splice(index, 1);
    setPrescription({
      ...prescription,
      medicines: updatedMedicines,
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...prescription.medicines];
    updatedMedicines[index][field] = value;
    setPrescription({
      ...prescription,
      medicines: updatedMedicines,
    });
  };

  const handleInstructionsChange = (e) => {
    setPrescription({
      ...prescription,
      instructions: e.target.value,
    });
  };

  const handleSubmitPrescription =async (e,patientId,appointmentId) => {
    e.preventDefault();
    
    // Validation
    const isValid = prescription.medicines.every(
      medicine => medicine.name && medicine.dosage && medicine.frequency
    );
    
    if (!isValid) {
      setErrorMessage('Please fill in all medicine details');
      return;
    }

try {
  console.log('enterd inside',prescription,patientId,appointmentId);
  const response=await api.post('/doctor/attendAppoinment',{prescription,patientId,appointmentId})
  if(response.data.success){
    console.log('submitted');
    
     setSuccessMessage(response.data.message)
     return setTimeout(()=>{
      setActiveModal(null);
     },2000)
  }
  console.log('not submitted');
  return setErrorMessage(response.data.message)
} catch (error) {
  console.log('error in handleSubmitPrescription in doctor patient consultation page',error);
  setErrorMessage('server error try later')
}

  };


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  if (isLoading) {
    return (
      <>
      <DoctorNav/>
      <div className="PatientConsulDocContainer">
        <div  style={{color:"white"}} className="PatientConsulDocLoading">Loading patient data ... or no appointments today</div>
      </div>
      </>
    );
  }


  return (
    <>
    <DoctorNav/>
    <div className="PatientConsulDocContainer">
      <div className="PatientConsulDocHeader">
        <h1 style={{color:"white"}}>Patient Consultation</h1>
        <div className="PatientConsulDocSearchContainer">
          <input
            type="text"
            className="PatientConsulDocSearchInput"
            placeholder="Search patients by name or email..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {successMessage && (
        <div style={{color:"green"}} className="PatientConsulDocSuccessMessage">{successMessage}</div>
      )}
      
      {errorMessage && (
        <div style={{color:"red"}} className="PatientConsulDocErrorMessage">{errorMessage}</div>
      )}

      <div className="PatientConsulDocPatientList">
        <h2>Patients</h2>
        <div className="PatientConsulDocTable">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Last Visit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map(patient => (
                <tr 
                  key={patient._id}
                  className={selectedPatient && selectedPatient._id === patient._id ? 'PatientConsulDocSelected' : ''}
                >
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{new Date(patient.lastVisit).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="PatientConsulDocButton PatientConsulDocViewButton"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="PatientConsulDocPagination">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className="PatientConsulDocButton PatientConsulDocPaginationButton"
          >
            Previous
          </button>
          <span className="PatientConsulDocPageInfo">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages || totalPages === 0}
            className="PatientConsulDocButton PatientConsulDocPaginationButton"
          >
            Next
          </button>
        </div>
      </div>

      {selectedPatient &&  (
        <div className="PatientConsulDocSelectedPatientCard">
          <div className="PatientConsulDocPatientInfo">
            <h2>Selected Patient</h2>
            <div className="PatientConsulDocInfo">
              <div className="PatientConsulDocRow">
                <span className="PatientConsulDocLabel">Name:</span>
                <span className="PatientConsulDocValue">{selectedPatient.name}</span>
              </div>
              
              <div className="PatientConsulDocRow">
                <span className="PatientConsulDocLabel">Contact:</span>
                <span className="PatientConsulDocValue">{selectedPatient.phone}</span>
              </div>
              
            </div>
          </div>
          
          <div className="PatientConsulDocActionButtons">
            <button 
              className="PatientConsulDocButton PatientConsulDocActionButton"
              onClick={() => openModal('medical')}
            >
              View Medical History
            </button>
            <button 
              className="PatientConsulDocButton PatientConsulDocActionButton"
              onClick={() => openModal('appointment')}
              disabled={!appointmentData}
            >
              View Appointment
            </button>
            <button 
              className="PatientConsulDocButton PatientConsulDocActionButton PatientConsulDocPrimaryButton"
              onClick={() => openModal('prescription')}
              disabled={!appointmentData}
            >
              Create Prescription
            </button>
          </div>
        </div>
      )}

     {/* Medical History Modal */}
{activeModal === 'medical' && selectedPatient && (
  <div className="PatientConsulDocModalOverlay">
    <div className="PatientConsulDocModal">
      <div className="PatientConsulDocModalHeader">
        <h2>Medical History</h2>
        <button 
          className="PatientConsulDocCloseButton"
          onClick={closeModal}
        >
          ×
        </button>
      </div>

      <div className="PatientConsulDocModalBody">
        {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
          selectedPatient.medicalHistory.map((med, index) => (
            <div className="PatientConsulDocSection" key={index}>
              <h3>Medical Condition</h3>
              <p>{med.condition || 'No condition specified'}</p>

              <h3>Diagnosis</h3>
              <p>{med.diagnosis || 'No known diagnosis'}</p>
            </div>
          ))
        ) : (
          <p>No medical history available</p>
        )}
      </div>

      <div className="PatientConsulDocModalFooter">
        <button 
          className="PatientConsulDocButton PatientConsulDocSecondaryButton"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


      {/* Appointment Modal */}
      {activeModal === 'appointment' && appointmentData && (
        <div className="PatientConsulDocModalOverlay">
          <div className="PatientConsulDocModal">
            <div className="PatientConsulDocModalHeader">
              <h2>Appointment Details</h2>
              <button 
                className="PatientConsulDocCloseButton"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div className="PatientConsulDocModalBody">
              <div className="PatientConsulDocInfo">
                <div className="PatientConsulDocRow">
                  <span className="PatientConsulDocLabel">Patient:</span>
                  <span className="PatientConsulDocValue">{appointmentData?.patient?.name}</span>
                </div>
                <div className="PatientConsulDocRow">
                  <span className="PatientConsulDocLabel">Date:</span>
                  <span className="PatientConsulDocValue">
                    {new Date(appointmentData?.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="PatientConsulDocRow">
                  <span className="PatientConsulDocLabel">Time:</span>
                  <span className="PatientConsulDocValue">{appointmentData?.timeSlot}</span>
                </div>
                <div className="PatientConsulDocRow">
                  <span className="PatientConsulDocLabel">Token Number:</span>
                  <span className="PatientConsulDocValue">{token?.tokenNumber}</span>
                </div>
                <div className="PatientConsulDocRow">
                  <span className="PatientConsulDocLabel">Status:</span>
                  <span className="PatientConsulDocValue">
                    <span className={`PatientConsulDocStatusBadge ${appointmentData?.status}`}>
                      {appointmentData?.status}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="PatientConsulDocModalFooter">
              
              <button 
                className="PatientConsulDocButton PatientConsulDocSecondaryButton"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {activeModal === 'prescription' && selectedPatient && (
        <div className="PatientConsulDocModalOverlay">
          <div className="PatientConsulDocModal PatientConsulDocLargeModal">
            <div className="PatientConsulDocModalHeader">
              <h2>Create Prescription</h2>
              <button 
                className="PatientConsulDocCloseButton"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div className="PatientConsulDocModalBody">
              <form onSubmit={(e)=>handleSubmitPrescription(e,selectedPatient._id,appointmentData._id)}>
                <div className="PatientConsulDocMedicines">
                  <h3>Medicines</h3>
                  <h6>{errorMessage||successMessage}</h6>

                  {prescription.medicines.map((medicine, index) => (
                    <div key={index} className="PatientConsulDocMedicineRow">
                      <div className="PatientConsulDocMedicineFields">
                        <div className="PatientConsulDocFormGroup">
                          <label htmlFor={`medicine-name-${index}`}>Medicine Name</label>
                          <input
                            id={`medicine-name-${index}`}
                            type="text"
                            value={medicine.name}
                            onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                            placeholder="Medicine name"
                          />
                        </div>
                        <div className="PatientConsulDocFormGroup">
                          <label htmlFor={`medicine-dosage-${index}`}>Dosage</label>
                          <input
                            id={`medicine-dosage-${index}`}
                            type="text"
                            value={medicine.dosage}
                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                            placeholder="e.g., 500mg"
                          />
                        </div>
                        <div className="PatientConsulDocFormGroup">
                          <label htmlFor={`medicine-frequency-${index}`}>Frequency</label>
                          <input
                            id={`medicine-frequency-${index}`}
                            type="text"
                            value={medicine.frequency}
                            onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                            placeholder="e.g., Twice daily"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="PatientConsulDocButton PatientConsulDocRemoveButton"
                        onClick={() => handleRemoveMedicine(index)}
                        disabled={prescription.medicines.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="PatientConsulDocFormGroup PatientConsulDocDiagnosis">
  <label htmlFor="diagnosis">Diagnosis</label>
  <input
    id="diagnosis"
    type="text"
    value={prescription.diagnosis}
    onChange={(e) => handleDiagnosisChange(e.target.value)}
    placeholder="Enter diagnosis"
  />
</div>
                  <button
                    type="button"
                    className="PatientConsulDocButton PatientConsulDocAddButton"
                    onClick={handleAddMedicine}
                  >
                    Add Medicine
                  </button>
                </div>

                <div className="PatientConsulDocFormGroup PatientConsulDocInstructions">
                  <label htmlFor="instructions">Special Instructions</label>
                  <textarea
                    id="instructions"
                    value={prescription.instructions}
                    onChange={handleInstructionsChange}
                    placeholder="Any special instructions for the patient"
                    rows={4}
                  />
                </div>

                <div className="PatientConsulDocModalFooter">
                  <button
                    type="submit"
                    className="PatientConsulDocButton PatientConsulDocPrimaryButton"
                  >
                    Save Prescription
                  </button>
                  <button 
                    type="button"
                    className="PatientConsulDocButton PatientConsulDocSecondaryButton"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
   </>
  );
};

export default PatientConsultationPage;