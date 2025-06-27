import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import "../../../assets/css/receptionist/AppoinmentShedule.css";
import RecepNav from "../partials/recepNav";
import api from "../../../services/axios";

const AppointmentScheduling = () => {
  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    date: "",
    timeSlot: "",
    status: "Pending",
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getPatientsAndDocs = async () => {
      Promise.all([
        api.get("/receptionist/getPatients"),
        api.get("/receptionist/getdoctors"),
      ])
        .then(([patientsResponse, doctorsResponse]) => {
          if (patientsResponse.data.success) {
            setPatients(patientsResponse.data.patients);
          } else {
            setMessage(patientsResponse.data.message);
          }

          if (doctorsResponse.data.success) {
            setDoctors(doctorsResponse.data.doctors);
          } else {
            setMessage(doctorsResponse.data.message);
          }
        })
        .catch((error) => {
          console.log("Error in fetching patients and doctors:", error);
          setMessage("Server error, try again later");
        });
    };

    getPatientsAndDocs();
  }, []);

  useEffect(() => {
    if (formData.date && formData.doctor) {
      const slots = [
        "09:00 AM - 09:30 AM",
        "09:30 AM - 10:00 AM",
        "10:00 AM - 10:30 AM",
        "10:30 AM - 11:00 AM",
        "11:00 AM - 11:30 AM",
        "02:00 PM - 02:30 PM",
        "02:30 PM - 03:00 PM",
        "03:00 PM - 03:30 PM",
        "03:30 PM - 04:00 PM",
      ];
      setAvailableTimeSlots(slots);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [formData.date, formData.doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient) newErrors.patient = "Please select a patient";
    if (!formData.doctor) newErrors.doctor = "Please select a doctor";
    if (!formData.date) newErrors.date = "Please select an appointment date";
    if (!formData.timeSlot) newErrors.timeSlot = "Please select a time slot";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await api.post("/receptionist/doctorAppoinment", {
        formData,
      });
      if (response.data.success) {
        setSubmitStatus("success");

        // Hide form and show success message
        setIsFormVisible(false);

        setTimeout(() => {
          setFormData({
            patient: "",
            doctor: "",
            date: "",
            timeSlot: "",
            status: "Pending",
          });
          setSubmitStatus(null);
          setIsFormVisible(true);
        }, 3000);
      }

      setMessage(response.data.message);
    } catch (error) {
      console.error("Error creating appointment:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90); // Allow bookings up to 90 days in advance
    return maxDate.toISOString().split("T")[0];
  };

  const getDoctorById = (id) => {
    return doctors.find((doctor) => doctor._id === id) || {};
  };

  const getPatientById = (id) => {
    return patients.find((patient) => patient._id === id) || {};
  };

  return (
    <>
      <RecepNav />
      <div className="appointmentRecepContainer">
        <div className="appointmentRecepCard">
          <div className="appointmentRecepHeader">
            <h1>Schedule New Appointment</h1>
            <p>Fill in the details below to schedule a patient appointment</p>
          </div>

          {submitStatus === "success" && !isFormVisible && (
            <div className="appointmentRecepSuccessMessage">
              <div className="appointmentRecepSuccessIcon">
                <CheckCircle size={48} />
              </div>
              <h2>Appointment Scheduled!</h2>
              <p>
                Appointment has been successfully created for{" "}
                {getPatientById(formData.patient).name} with{" "}
                {getDoctorById(formData.doctor).name} on{" "}
                {new Date(formData.date).toLocaleDateString()} at{" "}
                {formData.timeSlot}.
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="appointmentRecepErrorMessage">
              <AlertTriangle size={24} />
              <p>
                There was a problem scheduling the appointment. Please try
                again.
              </p>
            </div>
          )}

          {isFormVisible && (
            <form onSubmit={handleSubmit} className="appointmentRecepForm">
              <div className="appointmentRecepSection">
                <h2 className="appointmentRecepSectionTitle">
                  <User size={20} />
                  <span>Patient Information</span>
                </h2>

                <div className="appointmentRecepFormGroup">
                  <label htmlFor="patient" className="appointmentRecepLabel">
                    Select Patient{" "}
                    <span className="appointmentRecepRequired">*</span>
                  </label>
                  <div className="appointmentRecepSelectWrapper">
                    <select
                      id="patient"
                      name="patient"
                      value={formData.patient}
                      onChange={handleChange}
                      className={`appointmentRecepSelect ${
                        errors.patient ? "appointmentRecepInputError" : ""
                      }`}
                    >
                      <option value="">-- Select a patient --</option>
                      {patients.map((patient) => (
                        <option key={patient._id} value={patient._id}>
                          {patient.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.patient && (
                    <div className="appointmentRecepErrorText">
                      {errors.patient}
                    </div>
                  )}
                </div>
              </div>

              <div className="appointmentRecepSection">
                <h2 className="appointmentRecepSectionTitle">
                  <UserPlus size={20} />
                  <span>Doctor Selection</span>
                </h2>

                <div className="appointmentRecepFormGroup">
                  <label htmlFor="doctor" className="appointmentRecepLabel">
                    Select Doctor{" "}
                    <span className="appointmentRecepRequired">*</span>
                  </label>
                  <div className="appointmentRecepSelectWrapper">
                    <select
                      id="doctor"
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      className={`appointmentRecepSelect ${
                        errors.doctor ? "appointmentRecepInputError" : ""
                      }`}
                    >
                      <option value="">-- Select a doctor --</option>
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.name} - {doctor.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.doctor && (
                    <div className="appointmentRecepErrorText">
                      {errors.doctor}
                    </div>
                  )}
                </div>
              </div>

              <div className="appointmentRecepSection">
                <h2 className="appointmentRecepSectionTitle">
                  <Calendar size={20} />
                  <span>Appointment Details</span>
                </h2>

                <div className="appointmentRecepFormRow">
                  <div className="appointmentRecepFormGroup">
                    <label htmlFor="date" className="appointmentRecepLabel">
                      Appointment Date{" "}
                      <span className="appointmentRecepRequired">*</span>
                    </label>
                    <div className="appointmentRecepInputWrapper">
                      <Calendar
                        size={18}
                        className="appointmentRecepInputIcon"
                      />
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        onFocus={(e) =>
                          e.target.showPicker && e.target.showPicker()
                        }
                        min={getMinDate()}
                        max={getMaxDate()}
                        className={`appointmentRecepInput ${
                          errors.date ? "appointmentRecepInputError" : ""
                        }`}
                      />
                    </div>
                    {errors.date && (
                      <div className="appointmentRecepErrorText">
                        {errors.date}
                      </div>
                    )}
                  </div>

                  <div className="appointmentRecepFormGroup">
                    <label htmlFor="timeSlot" className="appointmentRecepLabel">
                      Time Slot{" "}
                      <span className="appointmentRecepRequired">*</span>
                    </label>
                    <div className="appointmentRecepSelectWrapper">
                      <Clock size={18} className="appointmentRecepInputIcon" />
                      <select
                        id="timeSlot"
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleChange}
                        disabled={!formData.date || !formData.doctor}
                        className={`appointmentRecepSelect ${
                          errors.timeSlot ? "appointmentRecepInputError" : ""
                        }`}
                      >
                        <option value="">-- Select time slot --</option>
                        {availableTimeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.timeSlot && (
                      <div className="appointmentRecepErrorText">
                        {errors.timeSlot}
                      </div>
                    )}
                    {!formData.date && !errors.timeSlot && (
                      <div className="appointmentRecepHelpText">
                        Please select a date first
                      </div>
                    )}
                    {formData.date && !formData.doctor && !errors.timeSlot && (
                      <div className="appointmentRecepHelpText">
                        Please select a doctor to see available slots
                      </div>
                    )}
                  </div>
                </div>

                <div className="appointmentRecepFormGroup">
                  <label htmlFor="status" className="appointmentRecepLabel">
                    Status
                  </label>
                  <div className="appointmentRecepSelectWrapper">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="appointmentRecepSelect"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="appointmentRecepFormActions">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      patient: "",
                      doctor: "",
                      date: "",
                      timeSlot: "",
                      status: "Pending",
                    });
                    setErrors({});
                  }}
                  className="appointmentRecepSecondaryButton"
                >
                  Clear Form
                </button>

                <button
                  type="submit"
                  className="appointmentRecepPrimaryButton"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="appointmentRecepLoadingSpinner"></span>
                  ) : (
                    "Schedule Appointment"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default AppointmentScheduling;
