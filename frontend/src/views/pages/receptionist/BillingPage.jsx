import React, { useState, useEffect } from "react";
import "../../../assets/css/receptionist/BillingRecep.css";
import RecepNav from "../partials/recepNav";
import api from "../../../services/axios";
import { useNavigate } from "react-router-dom";

const BillingPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prescription, setprescription] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get(
          "/receptionist/getAppoinments/prescriptions"
        );
        if (response.data.success) {
          setAppointments(response.data.appointments);
          setprescription(response.data.Prescriptions);
          setLoading(false);
        } else {
          setLoading(false);
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch appointments. Please try again later.");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "BillingRecepStatusCompleted";
      case "Cancelled":
        return "BillingRecepStatusCancelled";
      default:
        return "BillingRecepStatusPending";
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const closeAppointmentDetails = () => {
    setSelectedAppointment(null);
  };

  const handleShowPrescription = (e, patientId, prescription) => {
    e.stopPropagation();
    const matched = prescription.find((p) => p.patient?._id === patientId._id);
    if (matched) {
      setSelectedPrescription(matched);
      setShowPrescriptionModal(true);
    } else {
      alert("Prescription not found for this patient.");
    }
  };

  if (loading) {
    return <div className="BillingRecepLoading">Loading appointments...</div>;
  }

  if (error) {
    return <div className="BillingRecepError">{error}</div>;
  }

  return (
    <>
      <RecepNav />
      <button
        onClick={() => navigate("/TotalBills-Page")}
        style={{
          color: "#2e3a4d",
          backgroundColor: "white",
          borderRadius: "10px",
          marginLeft: "800px",
        }}
      >
        Show All Generated Bills{" "}
      </button>
      <div className="BillingRecepContainer">
        <header className="BillingRecepHeader">
          <h1 style={{ color: "white" }}>Billing Receptionist Dashboard</h1>
          <div style={{ color: "#fff" }} className="BillingRecepDate">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        <main className="BillingRecepMain">
          <section className="BillingRecepAppointmentList">
            <h2>Patient Appointments</h2>

            <div className="BillingRecepSearchBar">
              <input
                type="text"
                placeholder="Search patients..."
                className="BillingRecepSearchInput"
              />
              <button className="BillingRecepSearchButton">Search</button>
            </div>

            <div className="BillingRecepFilters">
              <select className="BillingRecepFilter">
                <option value="all">All Doctors</option>
                <option value="d1">Dr. Sarah Johnson</option>
                <option value="d2">Dr. Michael Chen</option>
                <option value="d3">Dr. James Wilson</option>
              </select>

              <input
                type="date"
                className="BillingRecepFilter"
                placeholder="Filter by date"
              />
            </div>

            <table className="BillingRecepTable">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                  <th>Appointments</th>
                  <th>Prescriptions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="BillingRecepTableRow"
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <td>{appointment.patient.name}</td>
                    <td>{appointment.doctor.name}</td>
                    <td>{formatDate(appointment.date)}</td>
                    <td>{appointment.timeSlot}</td>
                    <td>
                      <span
                        className={`BillingRecepStatus ${getStatusClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <button className="BillingRecepViewButton">View</button>
                    </td>
                    <td>
                      <button
                        className="BillingRecepprescription"
                        onClick={(e) =>
                          handleShowPrescription(
                            e,
                            appointment.patient,
                            prescription
                          )
                        }
                      >
                        Show Prescription
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="BillingRecepPagination">
              <button className="BillingRecepPaginationButton">Previous</button>
              <span>Page 1 of 1</span>
              <button className="BillingRecepPaginationButton">Next</button>
            </div>
          </section>

          {selectedAppointment && (
            <div className="BillingRecepOverlay">
              <div className="BillingRecepAppointmentDetails">
                <button
                  className="BillingRecepCloseButton"
                  onClick={closeAppointmentDetails}
                >
                  ×
                </button>

                <h2>Appointment Details</h2>

                <div className="BillingRecepDetailSection">
                  <h3>Patient Information</h3>
                  <div className="BillingRecepDetailRow">
                    <span className="BillingRecepDetailLabel">Name:</span>
                    <span className="BillingRecepDetailValue">
                      {selectedAppointment.patient?.name}
                    </span>
                  </div>
                  <div className="BillingRecepDetailRow">
                    <span className="BillingRecepDetailLabel">Contact:</span>
                    <span className="BillingRecepDetailValue">
                      {selectedAppointment.patient?.contact}
                    </span>
                  </div>
                  <div className="BillingRecepDetailRow">
                    <span className="BillingRecepDetailLabel">Email:</span>
                    <span className="BillingRecepDetailValue">
                      {selectedAppointment.patient?.email}
                    </span>
                  </div>
                </div>

                <div className="BillingRecepDetailSection">
                  <h3>Appointment Information</h3>
                  <div className="BillingRecepDetailRow">
                    <span className="BillingRecepDetailLabel">Doctor:</span>
                    <span className="BillingRecepDetailValue">
                      {selectedAppointment?.doctor?.name} (
                      {selectedAppointment?.doctor?.specialization})
                    </span>
                  </div>
                  <div className="BillingRecepDetailRow">
                    <span className="BillingRecepDetailLabel">Date:</span>
                    <span className="BillingRecepDetailValue">
                      {formatDate(selectedAppointment.date)}
                    </span>
                  </div>
                  <div className="BillingRecepDetailRow">
                    <span className="BillingRecepDetailLabel">Time:</span>
                    <span className="BillingRecepDetailValue">
                      {selectedAppointment.timeSlot}
                    </span>
                  </div>
                  <div className="BillingRecepDetailRow">
                    <span className="BillingRecepDetailLabel">Status:</span>
                    <span
                      className={`BillingRecepDetailValue BillingRecepStatus ${getStatusClass(
                        selectedAppointment.status
                      )}`}
                    >
                      {selectedAppointment.status}
                    </span>
                  </div>
                  <div className="BillingRecepDetailRow">
                    <span className="BillingRecepDetailLabel">Created:</span>
                    <span className="BillingRecepDetailValue">
                      {new Date(selectedAppointment.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPrescription && (
            <div className="BillingRecepOverlay">
              <div className="BillingRecepAppointmentDetails">
                <button
                  className="BillingRecepCloseButton"
                  onClick={() => setSelectedPrescription(null)}
                >
                  ×
                </button>
                <h2>Prescription</h2>
                <h6>{error}</h6>

                <div className="BillingRecepDetailRow">
                  <span className="BillingRecepDetailLabel">Doctor:</span>
                  <span className="BillingRecepDetailValue">
                    {selectedPrescription?.doctor?.name ||
                      "No doctor available"}
                  </span>
                </div>

                <div className="BillingRecepDetailRow">
                  <span className="BillingRecepDetailLabel">Medicines:</span>
                  <span className="BillingRecepDetailValue">
                    {selectedPrescription.medicines?.map((medicine, index) => (
                      <div key={index}>
                        <span>{medicine.name}</span> -
                        <span>{medicine.dosage}</span> -
                        <span>{medicine.frequency}</span>
                      </div>
                    )) || "No medicines prescribed"}
                  </span>
                </div>

                <div className="BillingRecepDetailRow">
                  <span className="BillingRecepDetailLabel">Instructions:</span>
                  <span className="BillingRecepDetailValue">
                    {selectedPrescription.instructions ||
                      "No instructions available"}
                  </span>
                </div>

                <div className="BillingRecepDetailRow">
                  <span className="BillingRecepDetailLabel">Created On:</span>
                  <span className="BillingRecepDetailValue">
                    {new Date(
                      selectedPrescription.createdAt
                    ).toLocaleString() || "No date available"}
                  </span>
                </div>

                <button
                  className="BillingRecepBillingButton"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPrescription(null);
                    navigate("/Generate-Bills", {
                      state: {
                        PrescriptionId: selectedPrescription._id,
                      },
                    });
                  }}
                >
                  Generate Bill
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default BillingPage;
