// PatientListPage.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Phone,
  MapPin,
  Calendar,
  ClipboardList,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../../../assets/css/doctor/patientProfile.css";
import DoctorNav from "../partials/DoctorNav";
import api from "../../../services/axios";

const PatientListPage = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setmessage] = useState("");
  const [billing, setBilling] = useState([]);
  const [prescriptions, setprescriptions] = useState([]);
  const [consultations, setconsultations] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(6);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get("/doctor/getpatients");
        if (response.data.success) {
          setIsLoading(false);
          console.log("patient data from backend", response.data.patients);
          setconsultations(response.data.consultations);
          setBilling(response.data.billing);
          setprescriptions(response.data.prescriptions);
          return setPatients(response.data.patients);
        }
        setmessage(response.data.message);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    // Filter patients based on search term
    if (searchTerm.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm) ||
          patient.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, patients]);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  return (
    <>
      <DoctorNav />
      <div className="patientprofileListDoc-container">
        <div className="patientprofileListDoc-header">
          <h1 style={{ color: "white" }}>Patient Directory</h1>
          <div className="patientprofileListDoc-search-container">
            <Search className="patientprofileListDoc-search-icon" />
            <input
              type="text"
              placeholder="Search by name, phone, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="patientprofileListDoc-search-input"
            />
            {searchTerm && (
              <button
                className="patientprofileListDoc-clear-button"
                onClick={() => setSearchTerm("")}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="patientprofileListDoc-statistics">
          <div className="patientprofileListDoc-stat-card">
            <div className="patientprofileListDoc-stat-value">
              {patients.length}
            </div>
            <div className="patientprofileListDoc-stat-label">
              Total Patients
            </div>
          </div>
          <div className="patientprofileListDoc-stat-card">
            <div className="patientprofileListDoc-stat-value">
              {patients.filter((p) => p.gender === "Male").length}
            </div>
            <div className="patientprofileListDoc-stat-label">Male</div>
          </div>
          <div className="patientprofileListDoc-stat-card">
            <div className="patientprofileListDoc-stat-value">
              {patients.filter((p) => p.gender === "Female").length}
            </div>
            <div className="patientprofileListDoc-stat-label">Female</div>
          </div>
          <div className="patientprofileListDoc-stat-card">
            <div className="patientprofileListDoc-stat-value">
              {patients.filter((p) => p.medicalHistory.length > 0).length}
            </div>
            <div className="patientprofileListDoc-stat-label">With Records</div>
          </div>
        </div>

        {isLoading ? (
          <div className="patientprofileListDoc-loading">
            <div className="patientprofileListDoc-loading-spinner"></div>
            <p>Loading patients...</p>
          </div>
        ) : (
          <>
            {filteredPatients.length === 0 ? (
              <div className="patientprofileListDoc-no-results">
                <Info size={48} />
                <h3>No patients found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            ) : (
              <>
                <div className="patientprofileListDoc-patients-grid">
                  {currentPatients.map((patient) => (
                    <div
                      key={patient._id}
                      className="patientprofileListDoc-patient-card"
                      onClick={() => handlePatientClick(patient)}
                    >
                      <div className="patientprofileListDoc-patient-header">
                        <div className="patientprofileListDoc-avatar">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="patientprofileListDoc-patient-info">
                          <h3 className="patientprofileListDoc-patient-name">
                            {patient.name}
                          </h3>
                          <span className="patientprofileListDoc-patient-basic-info">
                            {patient.age} yrs, {patient.gender}
                          </span>
                        </div>
                      </div>
                      <div className="patientprofileListDoc-patient-contact">
                        <div className="patientprofileListDoc-contact-item">
                          <Phone size={16} />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="patientprofileListDoc-contact-item">
                          <MapPin size={16} />
                          <span>
                            {patient.address
                              ? patient.address.substring(0, 25) +
                                (patient.address.length > 25 ? "..." : "")
                              : "No address"}
                          </span>
                        </div>
                      </div>
                      <div className="patientprofileListDoc-patient-footer">
                        <div className="patientprofileListDoc-medical-records">
                          <ClipboardList size={16} />
                          <span>
                            {patient.medicalHistory.length} medical record(s)
                          </span>
                        </div>
                        <div className="patientprofileListDoc-created-date">
                          <Calendar size={16} />
                          <span>Added: {formatDate(patient.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Section */}
                <div className="patientprofileListDoc-pagination">
                  <div className="patientprofileListDoc-pagination-info">
                    Showing{" "}
                    <span className="patientprofileListDoc-pagination-current">
                      {indexOfFirstPatient + 1}-
                      {Math.min(indexOfLastPatient, filteredPatients.length)}
                    </span>{" "}
                    of{" "}
                    <span className="patientprofileListDoc-pagination-total">
                      {filteredPatients.length}
                    </span>{" "}
                    patients
                  </div>
                  <div className="patientprofileListDoc-pagination-controls">
                    <button
                      className="patientprofileListDoc-pagination-button"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {/* Page numbers */}
                    <div className="patientprofileListDoc-pagination-pages">
                      {Array.from({ length: totalPages }, (_, i) => {
                        // Show first page, last page, current page, and pages ±1 from current
                        const pageNum = i + 1;

                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 &&
                            pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`patientprofileListDoc-pagination-page ${
                                currentPage === pageNum
                                  ? "patientprofileListDoc-pagination-active"
                                  : ""
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          (pageNum === 2 && currentPage > 3) ||
                          (pageNum === totalPages - 1 &&
                            currentPage < totalPages - 2)
                        ) {
                          // Show ellipsis
                          return (
                            <span
                              key={pageNum}
                              className="patientprofileListDoc-pagination-ellipsis"
                            >
                              ...
                            </span>
                          );
                        }

                        return null;
                      })}
                    </div>

                    <button
                      className="patientprofileListDoc-pagination-button"
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {showModal && selectedPatient && (
          <div
            className="patientprofileListDoc-modal-overlay"
            onClick={closeModal}
          >
            <div
              className="patientprofileListDoc-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="patientprofileListDoc-modal-close"
                onClick={closeModal}
              >
                ×
              </button>

              <div className="patientprofileListDoc-modal-header">
                <div className="patientprofileListDoc-modal-avatar">
                  {selectedPatient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="patientprofileListDoc-modal-name">
                    {selectedPatient.name}
                  </h2>
                  <p className="patientprofileListDoc-modal-subtitle">
                    Patient ID: #{selectedPatient._id}
                  </p>
                </div>
              </div>

              <div className="patientprofileListDoc-modal-body">
                <div className="patientprofileListDoc-info-section">
                  <h3>Personal Information</h3>
                  <div className="patientprofileListDoc-info-grid">
                    <div className="patientprofileListDoc-info-item">
                      <span className="patientprofileListDoc-info-label">
                        Age
                      </span>
                      <span className="patientprofileListDoc-info-value">
                        {selectedPatient.age} years
                      </span>
                    </div>
                    <div className="patientprofileListDoc-info-item">
                      <span className="patientprofileListDoc-info-label">
                        Gender
                      </span>
                      <span className="patientprofileListDoc-info-value">
                        {selectedPatient.gender}
                      </span>
                    </div>
                    <div className="patientprofileListDoc-info-item">
                      <span className="patientprofileListDoc-info-label">
                        Phone
                      </span>
                      <span className="patientprofileListDoc-info-value">
                        {selectedPatient.phone}
                      </span>
                    </div>
                    <div className="patientprofileListDoc-info-item">
                      <span className="patientprofileListDoc-info-label">
                        Registered On
                      </span>
                      <span className="patientprofileListDoc-info-value">
                        {formatDate(selectedPatient.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="patientprofileListDoc-info-section">
                  <h3>Address</h3>
                  <p className="patientprofileListDoc-address">
                    {selectedPatient.address || "No address provided"}
                  </p>
                </div>

                <div className="patientprofileListDoc-info-section">
                  <h3>Medical History</h3>
                  {selectedPatient.medicalHistory.length === 0 ? (
                    <p className="patientprofileListDoc-no-records">
                      No medical records available
                    </p>
                  ) : (
                    <div className="patientprofileListDoc-records-list">
                      {selectedPatient.medicalHistory.map((recordId, index) => (
                        <div
                          key={recordId}
                          className="patientprofileListDoc-record-item"
                        >
                          <ClipboardList size={18} />
                          <span>
                            Record #{index + 1} (ID: {recordId})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="patientprofileListDoc-info-section">
                  <h3>Past Consultations</h3>
                  {/* For Consultations */}
                  {consultations.filter(
                    (c) => c.patientId === selectedPatient._id
                  ).length === 0 ? (
                    <p className="patientprofileListDoc-no-records">
                      No consultations found
                    </p>
                  ) : (
                    <div className="patientprofileListDoc-records-list">
                      {consultations
                        .filter((c) => c.patientId === selectedPatient._id)
                        .map((consult, index) => (
                          <div
                            key={index}
                            className="patientprofileListDoc-record-item"
                          >
                            <CalendarDays size={18} />
                            <span>
                              {formatDate(consult.date)} with Dr.{" "}
                              {consult.doctorName}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="patientprofileListDoc-info-section">
                  <h3>Prescriptions</h3>
                  {/* For Prescriptions */}
                  {prescriptions.filter(
                    (p) => p.patientId === selectedPatient._id
                  ).length === 0 ? (
                    <p className="patientprofileListDoc-no-records">
                      No prescriptions found
                    </p>
                  ) : (
                    <div className="patientprofileListDoc-records-list">
                      {prescriptions
                        .filter((p) => p.patientId === selectedPatient._id)
                        .map((prescription, index) => (
                          <div
                            key={index}
                            className="patientprofileListDoc-record-item"
                          >
                            <FileText size={18} />
                            <span>
                              Prescription #{index + 1} –{" "}
                              {prescription.medicines.join(", ")}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="patientprofileListDoc-info-section">
                  <h3>Billing Records</h3>
                  {/* For Billing */}
                  {billing.filter((b) => b.patientId === selectedPatient._id)
                    .length === 0 ? (
                    <p className="patientprofileListDoc-no-records">
                      No billing data available
                    </p>
                  ) : (
                    <div className="patientprofileListDoc-records-list">
                      {billing
                        .filter((b) => b.patientId === selectedPatient._id)
                        .map((bill, index) => (
                          <div
                            key={index}
                            className="patientprofileListDoc-record-item"
                          >
                            <Receipt size={18} />
                            <span>
                              ₹{bill.amount} – {formatDate(bill.date)}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PatientListPage;
