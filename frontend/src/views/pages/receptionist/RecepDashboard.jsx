import React, { useEffect, useState } from "react";
import "../../../assets/css/receptionist/RecepDashboard.css";
import { motion } from "framer-motion";
import RecepNav from "../partials/recepNav";
import api from "../../../services/axios";

const RecepDashboard = () => {
  const [stats, setStats] = useState([
    {
      totalPatients: 0,
      tokensIssued: 0,
      appointments: { pending: 0, completed: 0 },
      billingTotal: 0,
    },
  ]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [DoctorSignupRequest, setDoctorSignupRequest] = useState();
  const [message, setmessage] = useState("");
  const [totalTokens, setTotalTokens] = useState(0);

  useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await api.get("/receptionist/getDashboardData");
        if (response.data.success) {
          setDoctorSignupRequest(response.data.DoctorSignupRequest);
          setStats(response.data.stats);
          setPendingAppointments(response.data.pendingAppointments);
          setTotalTokens(response.data.totalTokens);
        }
        setmessage(response.data.message);
      } catch (error) {
        console.log("error in getDatas recep dashboard", error);
        setmessage("server error");
      }
    };
    getDatas();
  }, []);

  return (
    <>
      <RecepNav />
      <div className="RecepDashboard__container">
        <motion.h2
          className="RecepDashboard__heading"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Receptionist Dashboard
        </motion.h2>

        <div className="RecepDashboard__stats">
          {Object.entries(stats).map(([key, value], i) => (
            <motion.div
              className="RecepDashboard__card"
              key={key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              <h4>{key.replace(/([A-Z])/g, " $1")}</h4>
              <p>
                {typeof value === "object"
                  ? `${value.pending} / ${value.completed}`
                  : value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="RecepDashboard__appointments">
          <h3>Upcoming Appointments</h3>
          <table className="RecepDashboard__table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingAppointments.map((appt, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td>{appt.time}</td>
                  <td>{appt.patient}</td>
                  <td>{appt.doctor}</td>
                  <td>
                    <span
                      className={`RecepDashboard__status ${appt.status.toLowerCase()}`}
                    >
                      {appt.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="RecepDashboard__notifications">
          <h3>Notifications</h3>
          <ul>
            <li>
              <a
                style={{ color: "inherit", textDecoration: "none" }}
                href="/Approve-Doctors"
              >
                🔔 {DoctorSignupRequest} doctor Appointments pending
                confirmation
              </a>
            </li>
            <li>📢Total Token issued successfully is : {totalTokens}</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default RecepDashboard;
