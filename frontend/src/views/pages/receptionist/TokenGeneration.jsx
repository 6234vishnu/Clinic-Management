import React, { useEffect, useState } from "react";
import "../../../assets/css/receptionist/tokenGeneration.css";
import api from "../../../services/axios";
import RecepNav from "../partials/recepNav";
import AnimatedTokenModal from "../../../components/AnimatedTokenModal";

const TokenGeneration = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [message, setMessage] = useState("");
  const [generatedToken, setGeneratedToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get(
          "/receptionist/generateToken/pendingAppointments"
        );
        if (res.data.success) {
          setAppointments(res.data.appointments);
          setCurrentPage(1); // Reset to first page on fetch
        } else {
          setMessage(res.data.message);
        }
      } catch (error) {
        setMessage("Server error. Try again later.");
      }
    };
    fetchAppointments();
  }, []);

  const handleGenerateToken = async () => {
    try {
      setLoading(true);
      const res = await api.post("/receptionist/generateToken", {
        appointmentId: selectedAppointment._id,
      });
      if (res.data.success) {
        setMessage("Token generated successfully.");
        setGeneratedToken(res.data.token);
        setAppointments((prev) =>
          prev.filter((a) => a._id !== selectedAppointment._id)
        );
      } else {
        setMessage(res.data.message || "Failed to generate token.");
      }
    } catch (error) {
      setMessage("Error generating token.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setGeneratedToken(null);
    setMessage("");
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  return (
    <>
      <RecepNav />
      <div className="tokenGenerationRecep-container">
        <h2 className="tokenGenerationRecep-heading">Pending Appointments</h2>
           <button className="tokenGenerationRecep-generatedTokens">Show Recently Generated Tokens</button>
        {message && <p className="tokenGenerationRecep-message">{message}</p>}
        <div style={{gap:"2rem"}} className="tokenGenerationRecep-list">
          {currentAppointments.length > 0 ? (
            currentAppointments.map((a) => (
              <div
                key={a._id}
                className="tokenGenerationRecep-card"
                onClick={() => {
                  setSelectedAppointment(a);
                  setGeneratedToken(null);
                  setMessage("");
                }}
              >
                <p>Patient: {a?.patient?.name}</p>
                <p>Doctor: {a?.doctor?.name}</p>
                <p>Date: {new Date(a.date).toLocaleDateString()}</p>
                <p>Time: {a?.timeSlot}</p>
                <p>Status: <strong style={{color:"red"}}>{a?.status}</strong></p>
              </div>
            ))
          ) : (
            <p>No pending appointments.</p>
          )}
        </div>

        {/* Pagination Controls */}
        {appointments.length > itemsPerPage && (
          <div className="tokenGenerationRecep-pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {selectedAppointment && (
          <div 
            className="tokenGenerationRecep-modalOverlay"
            onClick={closeModal}
          >
            
            <div
              className="tokenGenerationRecep-modal"
              onClick={(e) => e.stopPropagation()}
            >
                 <span
    className="tokenGenerationRecep-closeIcon"
    onClick={closeModal}
  >
    &times;
  </span>
              <h3>Generated Token</h3>
              <p>Patient: {selectedAppointment.patient.name}</p>
              <p>Doctor: {selectedAppointment.doctor.name}</p>
              <p>
                Date:{" "}
                {new Date(selectedAppointment.date).toLocaleDateString()}
              </p>
              <p>Time: {selectedAppointment.timeSlot}</p>

              {generatedToken ? (
                <div className="tokenGenerationRecep-tokenDisplay">
                 <AnimatedTokenModal token={generatedToken} />
                </div>
              ) : (
                <button onClick={handleGenerateToken} disabled={loading}>
                  {loading ? "Generating..." : "Generate Token"}
                </button>
              )}

              {/* <button
                className="tokenGenerationRecep-close"
                onClick={closeModal}
              >
                Close
              </button> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TokenGeneration;
