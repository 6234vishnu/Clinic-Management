import React from "react";
import '../../../assets/css/doctor/doctordashboard.css'
import { CalendarDays, ClipboardCheck, Users, FileText, Bell } from "lucide-react";
import DoctorNav from "../partials/DoctorNav";

const DoctorDashboard = ({ doctorName = "Dr. Vishnu", specialization = "Cardiologist" }) => {
  return (
    <>
    <DoctorNav/>
    <div className="docDashboard-container">
      <header className="docDashboard-header">
        <h1>Welcome, <span>{doctorName}</span></h1>
        <p className="docDashboard-specialization">{specialization}</p>
      </header>

      <div className="docDashboard-grid">
        <div className="docDashboard-card docDashboard-hover">
          <CalendarDays size={32} />
          <h2>Today's Appointments</h2>
          <p>5 Scheduled</p>
        </div>

        <div className="docDashboard-card docDashboard-hover">
          <Users size={32} />
          <h2>Total Patients Consulted</h2>
          <p>143</p>
        </div>

        <div className="docDashboard-card docDashboard-hover">
          <FileText size={32} />
          <h2>Pending Prescriptions</h2>
          <p>3 Pending</p>
        </div>

        <div className="docDashboard-card docDashboard-hover">
          <ClipboardCheck size={32} />
          <h2>Billing Approvals</h2>
          <p>2 Requests</p>
        </div>

        <div className="docDashboard-card docDashboard-notification">
          <Bell size={32} />
          <h2>Notifications</h2>
          <ul>
            <li>New appointment booked</li>
            <li>1 prescription needs attention</li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default DoctorDashboard;
