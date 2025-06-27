import React, { useEffect, useState } from "react";
import api from "../../../services/axios";
import RecepNav from "../partials/recepNav";
import "../../../assets/css/receptionist/generatedTokens.css";

function ShowTokens() {
  const [tokens, setTokens] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 2;

  useEffect(() => {
    const getTokens = async () => {
      try {
        const response = await api.get(
          `/receptionist/getGeneratedTokens?page=${page}&limit=${limit}`
        );
        if (response.data.success) {
          setTokens(response.data.tokens);
          setTotalPages(response.data.totalPages);
        } else {
          setTokens([]);
        }
        setMessage(response.data.success);
      } catch (error) {
        console.log("error in getTokens", error);
        setMessage("Server error, try again later");
      }
    };
    getTokens();
  }, [page]);

  const cancelToken = async (e, tokenId) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `/receptionist/cancelToken?Token=${tokenId}`
      );
      if (response.data.success) {
        setMessage(response.data.message);
      }
      setMessage(response.data.message);
    } catch (error) {
      console.log("server error try later");
      setMessage("server error try later");
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <>
      <RecepNav />
      <div className="generatedTokenRecep-container">
        <h1 className="generatedTokenRecep-title" style={{ color: "white" }}>
          Generated Tokens
        </h1>

        <div className="generatedTokenRecep-list">
          {tokens.length === 0 ? (
            <p className="generatedTokenRecep-message">No tokens found.</p>
          ) : (
            tokens.map((token) => (
              <div key={token._id} className="generatedTokenRecep-card">
                <p>{message}</p>
                <img
                  className="generatedTokenRecep-spinImage"
                  style={{
                    width: "78px",
                    height: "78px",
                    borderRadius: "25px",
                  }}
                  src="\src\assets\images\tokenImage.jpg"
                  alt=""
                />
                <h2 className="generatedTokenRecep-tokenNumber">
                  Token {token.tokenNumber}
                </h2>
                <p className="generatedTokenRecep-info">
                  <strong>Patient:</strong> {token.patient?.name}
                </p>
                <p className="generatedTokenRecep-info">
                  <strong>Doctor:</strong> {token.doctor?.name} (
                  {token.doctor?.specialization})
                </p>
                <p
                  className={`generatedTokenRecep-status ${token.status.toLowerCase()}`}
                >
                  {token.status}
                </p>
                <p className="generatedTokenRecep-date">
                  {new Date(token.createdAt).toLocaleString()}
                </p>

                {token?.status === "Waiting" && (
                  <>
                    <button
                      onClick={(e) => cancelToken(e, token._id)}
                      className="generatedTokenRecep-cancelBtn"
                    >
                      Cancel
                    </button>

                    <p style={{ paddingTop: "15px" }}>
                      <strong>Note:</strong> If canceled It will also cancel the
                      appoinment
                    </p>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {tokens.length > 0 && (
          <div className="generatedTokenRecep-pagination">
            <button disabled={page === 1} onClick={handlePrev}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button disabled={page === totalPages} onClick={handleNext}>
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ShowTokens;
