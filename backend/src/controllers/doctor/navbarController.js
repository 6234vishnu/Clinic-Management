import Patient from "../../models/patientSchema.js";
import Appoinments from "../../models/appoinmentSchema.js";
import Prescriptions from "../../models/prescriptionSchema.js";
import Bill from "../../models/billingSchema.js";
import Token from "../../models/tokenSchema.js";
import MedicalRecord from "../../models/medicalRecordSchema.js"

export const getpatients = async (req, res) => {
  try {
  const {doctorId}=req.query
  
  const appointments = await Appoinments.find({
    doctor: doctorId,
  }).populate({
    path: "patient",
    populate: {
      path: "medicalHistory",

    },
  });
  
    if (!appointments || appointments.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No appointments with doctors found",
      });
    }
    const patients = [];
    const patientIds = new Set();
    
    appointments.forEach((appointment) => {
      if (appointment.patient && !patientIds.has(appointment.patient._id.toString())) {
        patients.push(appointment.patient);
        patientIds.add(appointment.patient._id.toString());
      }
    });
    
    const prescriptions = await Prescriptions.find({ doctor: doctorId }).populate('doctor').populate("patient")
    const bills = await Bill.find({ doctor: doctorId })
    
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
        .json({ success: false, message: "Prescription is already given" });
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
    const createMedicalRecord=new MedicalRecord({
      patient:patientId,
      doctor: findPatientAppoinment.doctor,
      prescriptions:savePrescription._id,
      diagnosis:prescription.diagnosis

    })
    const saveMedicalRecord=await createMedicalRecord.save()
    if(!saveMedicalRecord){
      return res
      .status(200)
      .json({ success: false, message: "server error try later " });
    }

    const addMedicalHistoryInPatient=await Patient.findByIdAndUpdate(patientId,{$set:{medicalHistory:saveMedicalRecord._id}})
    if(!addMedicalHistoryInPatient){
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


export const getMedicalRecord=async(req,res)=>{
  try {
    
    const getMedicalRecord=await MedicalRecord.find({patient:req.params.patientId}).populate("prescriptions")
    if(!getMedicalRecord){
      return res
      .status(200)
      .json({ success: false, message: "server error try later " });
    }
    res.json({ success: true, medicalRecord:getMedicalRecord });
  } catch (error) {
    console.log("error in getMedicalRecord doctorRoute", error);
    return res
      .status(500)
      .json({ success: false, message: "server error try later " });
  }
}