import Patient from "../../models/patientSchema.js";
import Appoinments from "../../models/appoinmentSchema.js";
import Prescriptions from "../../models/prescriptionSchema.js";
import Bill from "../../models/billingSchema.js";
import Token from "../../models/tokenSchema.js";

export const getpatients = async (req, res) => {
  try {
  
    const appointments = await Appoinments.find({
      doctor: { $ne: null },status:"Pending"
    }).populate("doctor");

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No appointments with doctors found",
      });
    }

 
    const patientIds = [
      ...new Set(appointments.map((app) => app.patient.toString())),
    ];


    const patients = await Patient.find({ _id: { $in: patientIds } });

    // Step 4: Fetch prescriptions and billing
    const prescriptions = await Prescriptions.find();
    const bills = await Bill.find();

    return res.status(200).json({
      success: true,
      patients,
      consultations: appointments,
      prescriptions,
      billing: bills,
    });
  } catch (error) {
    console.log("error in getpatients doctor", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDocsAppoinments = async (req, res) => {
  try {
    const { docId } = req.query;
    if (!docId) {
      return res.status(200).json({
        success: false,
        message: "login first to do further activites",
      });
    }

    const findAppoinments = await Appoinments.find({ doctor: docId })
      .populate("patient")
      .populate("prescription")
      .sort({ date: -1 });
    if (!findAppoinments) {
      return res.status(200).json({
        success: false,
        message: "you dont have any appoinments",
      });
    }
    return res
      .status(200)
      .json({ success: true, appointments: findAppoinments });
  } catch (error) {
    console.log("error in getDocsAppoinments doctor", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getPatientsAppoinments = async (req, res) => {
  try {
    const { patientId } = req.query;
    if (!patientId) {
      return res
        .status(200)
        .json({ success: false, message: "couldint find any patients" });
    }
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const getAppointments = await Appoinments.find({
      patient: patientId,
      status: "Pending",
    })
      .populate("prescription")
      .populate("patient")
      .populate("doctor");

    if (!getAppointments || getAppointments.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "Couldn't find any appointments" });
    }

    const firstAppointment = getAppointments[0];
    const getToken = await Token.findOne({
      appoinmentId: firstAppointment._id,
    });
 

    if (!getToken) {
      return res
        .status(200)
        .json({
          success: false,
          message: "Couldn't find any tokens in this appointment",
        });
    }
    return res
      .status(200)
      .json({ success: true, appointments: getAppointments, token: getToken });
  } catch (error) {
    console.log("error in getPatientsAppoinments doctor", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const generatePrescriptions = async (req, res) => {
  try {
    const { prescription, patientId, appointmentId } = req.body;
    if (!prescription && !patientId && !appointmentId) {
      return res
        .status(200)
        .json({ success: false, message: "server error try later " });
    }
    const findPatientAppoinment = await Appoinments.findOne({
      patient: patientId,
      _id: appointmentId,
    });
    if (!findPatientAppoinment) {
      return res
        .status(200)
        .json({
          success: false,
          message: "couldint find any appointment of this patient",
        });
    }
    findPatientAppoinment.status = "Completed";
    const setAppoinmentStatus = await findPatientAppoinment.save();
    if (!setAppoinmentStatus) {
      return res
        .status(200)
        .json({ success: false, message: "server error try later " });
    }
    const setPrescription = new Prescriptions({
      patient: patientId,
      doctor: findPatientAppoinment.doctor,
      medicines: prescription.medicines,
      instructions: prescription.instructions,
    });
    const savePrescription =await setPrescription.save();
    if (!savePrescription) {
      return res
        .status(200)
        .json({ success: false, message: "server error try later " });
    }
    return res
      .status(200)
      .json({ success: true, message: "prescription saved successFully" });
  } catch (error) {
    console.log("error in generatePrescriptions doctorRoute", error);
    return res
      .status(500)
      .json({ success: false, message: "server error try later " });
  }
};
