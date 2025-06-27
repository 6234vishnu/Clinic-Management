import Patient from "../../models/patientSchema.js";
import Appoinments from "../../models/appoinmentSchema.js";
import Prescriptions from "../../models/prescriptionSchema.js";
import Bill from "../../models/billingSchema.js";
import Token from "../../models/tokenSchema.js";
import MedicalRecord from "../../models/medicalRecordSchema.js";
import Doctor from "../../models/doctorSchema.js";
import moment from "moment";

export const getpatients = async (req, res) => {
  try {
    const { doctorId } = req.query;

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
      if (
        appointment.patient &&
        !patientIds.has(appointment.patient._id.toString())
      ) {
        patients.push(appointment.patient);
        patientIds.add(appointment.patient._id.toString());
      }
    });

    const prescriptions = await Prescriptions.find({ doctor: doctorId })
      .populate("doctor")
      .populate("patient");
    const bills = await Bill.find({ doctor: doctorId });

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

export const getDoctorDetails = async (req, res) => {
  try {
    const { docId } = req.query;
    if (!docId) {
      return res
        .status(200)
        .json({ success: false, message: "couldint find doctor" });
    }

    const findDoctor = await Doctor.findById(docId);
    if (!findDoctor) {
      return res
        .status(200)
        .json({ success: false, message: "couldint find doctor" });
    }
    return res.status(200).json({ success: true, name: findDoctor.name });
  } catch (error) {}
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
      return res.status(200).json({
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
      return res.status(200).json({
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
    const savePrescription = await setPrescription.save();
    if (!savePrescription) {
      return res
        .status(200)
        .json({ success: false, message: "server error try later " });
    }
    const createMedicalRecord = new MedicalRecord({
      patient: patientId,
      doctor: findPatientAppoinment.doctor,
      prescriptions: savePrescription._id,
      diagnosis: prescription.diagnosis,
    });
    const saveMedicalRecord = await createMedicalRecord.save();
    if (!saveMedicalRecord) {
      return res
        .status(200)
        .json({ success: false, message: "server error try later " });
    }

    const addMedicalHistoryInPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $set: { medicalHistory: saveMedicalRecord._id } }
    );
    if (!addMedicalHistoryInPatient) {
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

export const getMedicalRecord = async (req, res) => {
  try {
    const getMedicalRecord = await MedicalRecord.find({
      patient: req.params.patientId,
    }).populate("prescriptions");
    if (!getMedicalRecord) {
      return res
        .status(200)
        .json({ success: false, message: "server error try later " });
    }
    res.json({ success: true, medicalRecord: getMedicalRecord });
  } catch (error) {
    console.log("error in getMedicalRecord doctorRoute", error);
    return res
      .status(500)
      .json({ success: false, message: "server error try later " });
  }
};

export const DashboardData = async (req, res) => {
  try {
    const { doctorId } = req.query;

    const findDoctor = await Doctor.findById(doctorId);
    if (!findDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Couldn't find doctor" });
    }

    const startOfWeek = moment().startOf("week").toDate();
    const endOfWeek = moment().endOf("week").toDate();

    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    const todaysAppointments = await Appoinments.countDocuments({
      doctor: findDoctor._id,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    // PROMISES: Run all in parallel
    const [
      getAppointments,
      getConsultedPatientCount,
      pendingPrescriptionsCount,
      totalAmountGenerated,
    ] = await Promise.all([
      Appoinments.aggregate([
        {
          $match: {
            doctor: findDoctor._id,
            date: { $gte: startOfWeek, $lte: endOfWeek },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$date" }, // Sunday=1, Saturday=7
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            dayOfWeek: "$_id",
            appointments: "$count",
            _id: 0,
          },
        },
      ]),

      // 2. Count of unique patients consulted (Completed status)
      Appoinments.aggregate([
        { $match: { doctor: findDoctor._id, status: "Completed" } },
        { $group: { _id: "$patient" } },
        { $count: "totalPatients" },
      ]),

      // 3. Pending prescriptions count
      Appoinments.countDocuments({
        doctor: findDoctor._id,
        status: "Pending",
      }),

      // 4. Total amount generated by doctor
      Bill.aggregate([
        { $match: { doctor: findDoctor._id } },
        { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
      ]),
    ]);

    // Format weekly data
    const weekMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const fullWeekData = Array.from({ length: 7 }).map((_, i) => {
      const dayLabel = weekMap[i];
      const dayIndex = i + 1; // MongoDB $dayOfWeek: Sunday = 1
      const dayData = getAppointments.find((d) => d.dayOfWeek === dayIndex);
      return {
        date: dayLabel,
        appointments: dayData ? dayData.appointments : 0,
      };
    });

    return res.status(200).json({
      success: true,
      dashboardData: {
        doctorName: findDoctor.name,
        specialization: findDoctor.specialization,
        todaysAppoinments: todaysAppointments,
        totalConsultedpatients: getConsultedPatientCount[0]?.totalPatients || 0,
        pendingPrescription: pendingPrescriptionsCount,
        totalGeneratedAmount: totalAmountGenerated[0]?.totalAmount || 0,
      },
      appoinments: fullWeekData,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const docLogout = async (req, res) => {
  try {
    const { docId } = req.query;

    if (!docId) {
      return res.status(200).json({
        success: false,
        message: "Server Error",
      });
    }
    const findDoctor = await Doctor.findById(docId);
    if (!findDoctor) {
      return res.status(200).json({
        success: false,
        message: "Couldint find receptionist ",
      });
    }
    res.clearCookie("authTokenDoc", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // set to true in production with HTTPS
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in docLogout:", error);
    res.status(500).json({
      success: false,
      message: "Server error docLogout",
    });
  }
};
