import React from "react";
import '../../../assets/css/receptionist/RecepDashboard.css'
import { motion } from "framer-motion";
import RecepNav from "../partials/recepNav";

const RecepDashboard = () => {
  const stats = {
    totalPatients: 18,
    tokensIssued: 15,
    appointments: { pending: 4, completed: 11 },
    billingTotal: "₹12,450",
  };

  const upcomingAppointments = [
    { time: "10:00 AM", patient: "John Doe", doctor: "Dr. Smith", status: "Pending" },
    { time: "10:30 AM", patient: "Priya Shah", doctor: "Dr. Nair", status: "Pending" },
    { time: "11:00 AM", patient: "Amit Kumar", doctor: "Dr. Rao", status: "Confirmed" },
  ];

  return (
    <>
    <RecepNav/>
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
            <p>{typeof value === "object" ? `${value.pending} / ${value.completed}` : value}</p>
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
            {upcomingAppointments.map((appt, index) => (
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
                  <span className={`RecepDashboard__status ${appt.status.toLowerCase()}`}>
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
          <li>🔔 2 Appointments pending confirmation</li>
          <li>💬 doctor signup request is:  </li>
          <li>📢 Token 105 issued successfully</li>
        </ul>
      </div>
    </div>
    </>
  );
};

export default RecepDashboard;
