import React, { useState } from "react";
import "../../../assets/css/receptionist/PatientList.css";
import RecepNav from "../partials/recepNav";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import api from "../../../services/axios";

const PatientList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [message, setMessage] = useState("");
  const [realPatients, setRealPatients] = useState([
    {
      _id: "",
      name: "",
      age: 0,
      gender: "",
      phone: "",
      address: "",
      createdAt: "",
    },
  ]);
  const [appointments, setAppoinments] = useState([
    {
      _id: "",
      patientId: "",
      doctorId: "",
      date: "",
      timeSlot: "",
      status: "",
    },
  ]);
  const patientsPerPage = 2;

  const patients =  realPatients;

  const patientsWithAppointments = patients.map((p) => ({
    ...p,
    appointments: appointments.filter((a) => a.patient === p._id),
  }));
  

  const filteredPatients = patientsWithAppointments.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  useState(() => {
    const getPatientsAndAppoinments = async () => {
      try {
        const response = await api.get("/receptionist/getPatientListAndAppoinments");
        if (response.data.success) {
          console.log('patients',response.data.patients);
          console.log('appoinment',response.data.appointments);
          
          setRealPatients(response.data.patients);
          setAppoinments(response.data.appointments);
        }
        setMessage(response.data.message);
      } catch (error) {
        console.log("error in patientList getPatientsAndAppoinments", error);
        setMessage("server error try later");
      }
    };
    getPatientsAndAppoinments();
  }, []);

  return (
    <>
      <RecepNav />
      <div className="PatientListRecep-container">
        <div className="PatientListRecep-header">
          <h1 className="PatientListRecep-title">Patient List</h1>
          <div className="PatientListRecep-search-container">
            <div className="PatientListRecep-search-input-wrapper">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search patients by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="PatientListRecep-list-container">
          {currentPatients.length > 0 ? (
            currentPatients.map((patient) => (
              <div
                key={patient?._id}
                className="PatientListRecep-patient-card"
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="PatientListRecep-avatar-circle">
                  {patient?.name.charAt(0)}
                </div>
                <div className="PatientListRecep-patient-details">
                  <h2>{patient?.name}</h2>
                  <p>
                    {patient?.age} years • {patient?.gender}
                  </p>
                  <p>Patient since {formatDate(patient?.createdAt)}</p>
                  <p>
                    <Phone size={16} /> {patient?.phone}
                  </p>
                  <p>
                    <MapPin size={16} /> {patient?.address}
                  </p>
   
                </div>
              </div>
            ))
          ) : (
            <div className="PatientListRecep-no-results">
              <User size={40} />
              <p>No patients found</p>
            </div>
          )}
        </div>

        <div className="PatientListRecep-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft /> Prev
          </button>
          <span style={{ color: "white" }}>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next <ChevronRight />
          </button>
        </div>

        {selectedPatient && (
          <div
            className="patientListRecep-modalOverlay"
            onClick={() => setSelectedPatient(null)}
          >
            <div
              className="patientListRecep-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedPatient(null)}>×</button>
              <h2>{selectedPatient.name}</h2>
              <p>Age: {selectedPatient.age}</p>
              <p>Gender: {selectedPatient.gender}</p>
              <p>Phone: {selectedPatient.phone}</p>
              <p>Address: {selectedPatient.address}</p>
              <p>Medical Records: {selectedPatient.medicalHistory.length}</p>

              <h3>Appointments</h3>
              {selectedPatient.appointments.length > 0 ? (
                <ul>
                  {selectedPatient.appointments.map((a) => (
                    <li key={a._id}>
                      <p>Doctor: {a.doctor?.name}</p>
                      <p>Date: {new Date(a.date).toLocaleDateString()}</p>
                      <p>Time: {a.timeSlot}</p>
                      <p>Status: {a.status}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No appointments</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PatientList;
