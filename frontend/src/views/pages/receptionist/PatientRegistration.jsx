import React, { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import "../../../assets/css/receptionist/PatientRegister.css";
import RecepNav from "../partials/recepNav";
import api from "../../../services/axios";
const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (
      isNaN(formData.age) ||
      parseInt(formData.age) <= 0 ||
      parseInt(formData.age) > 120
    ) {
      newErrors.age = "Please enter a valid age (1-120)";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      try {
        const response = await api.post("/receptionist/registerPatient", {
          formData,
        });
        if (response.data.success) {
          setSubmitted(true);
          setTimeout(() => {
            setFormData({
              name: "",
              age: "",
              gender: "",
              phone: "",
              address: "",
            });
            setSubmitted(false);
          }, 1000);
        }

        setMessage(response.data.message);
      } catch (error) {
        setSubmitted(false);
        console.log("error in patient register");
        return setMessage("server error try later");
      }
    }
  };

  return (
    <>
      <RecepNav />
      <div className="patientRegisterRecepContainer">
        <div className="patientRegisterRecepCard">
          <div className="patientRegisterRecepHeader">
            <h1>Patient Registration</h1>
            <p>{message}</p>
          </div>

          {submitted && (
            <div className="patientRegisterRecepSuccess">
              <Check size={24} />
              <p>Patient registered successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="patientRegisterRecepForm">
            <div className="patientRegisterRecepFormGroup">
              <label htmlFor="name" className="patientRegisterRecepLabel">
                Full Name{" "}
                <span className="patientRegisterRecepRequired">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`patientRegisterRecepInput ${
                  errors.name ? "patientRegisterRecepInputError" : ""
                }`}
                placeholder="Enter patient's full name"
              />
              {errors.name && (
                <div className="patientRegisterRecepErrorMessage">
                  <AlertCircle size={16} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="patientRegisterRecepRow">
              <div className="patientRegisterRecepFormGroup patientRegisterRecepHalfWidth">
                <label htmlFor="age" className="patientRegisterRecepLabel">
                  Age <span className="patientRegisterRecepRequired">*</span>
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`patientRegisterRecepInput ${
                    errors.age ? "patientRegisterRecepInputError" : ""
                  }`}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                />
                {errors.age && (
                  <div className="patientRegisterRecepErrorMessage">
                    <AlertCircle size={16} />
                    <span>{errors.age}</span>
                  </div>
                )}
              </div>

              <div className="patientRegisterRecepFormGroup patientRegisterRecepHalfWidth">
                <label htmlFor="gender" className="patientRegisterRecepLabel">
                  Gender <span className="patientRegisterRecepRequired">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`patientRegisterRecepSelect ${
                    errors.gender ? "patientRegisterRecepInputError" : ""
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <div className="patientRegisterRecepErrorMessage">
                    <AlertCircle size={16} />
                    <span>{errors.gender}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="patientRegisterRecepFormGroup">
              <label htmlFor="phone" className="patientRegisterRecepLabel">
                Phone Number{" "}
                <span className="patientRegisterRecepRequired">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`patientRegisterRecepInput ${
                  errors.phone ? "patientRegisterRecepInputError" : ""
                }`}
                placeholder="Enter 10-digit phone number"
              />
              {errors.phone && (
                <div className="patientRegisterRecepErrorMessage">
                  <AlertCircle size={16} />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            <div className="patientRegisterRecepFormGroup">
              <label htmlFor="address" className="patientRegisterRecepLabel">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="patientRegisterRecepTextarea"
                placeholder="Enter patient's address"
                rows="3"
              />
            </div>

            <div className="patientRegisterRecepFormFooter">
              <button
                type="reset"
                className="patientRegisterRecepButtonSecondary"
              >
                Clear Form
              </button>
              <button
                type="submit"
                className="patientRegisterRecepButtonPrimary"
              >
                Register Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PatientRegistration;
