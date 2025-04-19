import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import '../../../assets/css/doctor/doctordashboard.css';
import { CalendarDays, ClipboardCheck, Users, FileText, Bell } from "lucide-react";
import DoctorNav from "../partials/DoctorNav";
import api from "../../../services/axios";

const DoctorDashboard = () => {

  const [dashboardData,setDashboardData]=useState([{
    doctorName:"",specialization:"",
    todaysAppoinments:0,totalConsultedpatients:0,
    pendingPrescription:0,totalGeneratedAmount:0,

  }])

  const docId=localStorage.getItem('docId')
  const [appointmentData,setAppointmentData]=useState([])
  const [message,setMessage]=useState("")

useEffect(()=>{
  const getDatas=async()=>{
   try {
    const response=await api.get(`/doctor/dashboardData?doctorId=${docId}`)
    if(response.data.success){
setDashboardData(response.data.dashboardData)
return setAppointmentData(response.data.appoinments)
    }
   return setMessage(response.data.message)
   } catch (error) {
    setMessage('server error try later')
    console.log('error in getDatas DoctorDashboard',error);
    
   }
  }
  getDatas()
},[])

  // const appointmentData = [
  //   { date: "Mon", appointments: 3 },
  //   { date: "Tue", appointments: 5 },
  //   { date: "Wed", appointments: 4 },
  //   { date: "Thu", appointments: 6 },
  //   { date: "Fri", appointments: 2 },
  //   { date: "Sat", appointments: 4 },
  //   { date: "Sun", appointments: 1 },
  // ];

  return (
    <>
      <DoctorNav />
      <div className="docDashboard-container">
        <header className="docDashboard-header">
          <h1>Welcome, <span>{dashboardData.doctorName}</span></h1>
          <p className="docDashboard-specialization">{dashboardData.specialization}</p>
          <h6>{message}</h6>
        </header>

        <div className="docDashboard-grid">
          <div className="docDashboard-card docDashboard-hover">
            <CalendarDays size={32} />
            <h2>Today's Appointments</h2>
            <p>{dashboardData.todaysAppoinments} Scheduled</p>
          </div>

          <div className="docDashboard-card docDashboard-hover">
            <Users size={32} />
            <h2>Total Patients Consulted</h2>
            <p>{dashboardData.totalConsultedpatients}</p>
          </div>

          <div className="docDashboard-card docDashboard-hover">
            <FileText size={32} />
            <h2>Pending Prescriptions</h2>
            <p>{dashboardData.pendingPrescription} Pending</p>
          </div>

          <div className="docDashboard-card docDashboard-hover">
            <ClipboardCheck size={32} />
            <h2>Total Amount Generated</h2>
            <p>{dashboardData.totalGeneratedAmount} Rupees</p>
          </div>

        
        </div>

        <div className="docDashboard-chart-section">
          <h2>Appointments This Week</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="appointments" fill="#2e3a4d" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
