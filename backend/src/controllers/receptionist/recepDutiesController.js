import Doctor from "../../models/doctorSchema.js";
import Patient from "../../models/patientSchema.js";
import Appoinment from "../../models/appoinmentSchema.js";
import Token from "../../models/tokenSchema.js";
import Prescription from "../../models/prescriptionSchema.js";
import Bill from "../../models/billingSchema.js";
import mongoose from "mongoose";
export const unApprovedDoctors = async (req, res) => {
  try {
    const findUnapprovedDocs = await Doctor.find({ isApproved: false });

    if (!findUnapprovedDocs) {
      return res
        .status(200)
        .json({ success: false, message: "no new signUp to approve" });
    }
    return res.status(200).json({ success: true, doctor: findUnapprovedDocs });
  } catch (error) {
    console.log("error in unapproved doctors in recepRoute", error);

    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const approveDoctors = async (req, res) => {
  try {
    const id = req.params.doctorId;
    if (!id) {
      return res.status(200).json({
        success: false,
        message: "couldint approve there is a server error",
      });
    }
    const findDoctor = await Doctor.findById(id);
    if (!findDoctor) {
      return res.status(200).json({
        success: false,
        message: "there is no doctor signed up in this address",
      });
    }
    const approveDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: { isApproved: true } },
      { new: true }
    );
    if (!approveDoctor) {
      return res.status(200).json({
        success: false,
        message: "couldint approve there is a server error",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: `Approved ${findDoctor.name} signUp` });
  } catch (error) {
    console.log("error in approveDoctors in recepRoute", error);

    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const registerPatient = async (req, res) => {
  try {
    const { name, age, gender, phone, address } = req.body.formData;
    if (!name && !age && !gender && !phone && !address) {
      return res
        .status(200)
        .json({ success: false, message: "fill all the details " });
    }

    const newPatient = new Patient({
      name,
      age,
      gender,
      phone,
      address,
    });

    const savepatient = await newPatient.save();

    if (!savepatient) {
      return res.status(200).json({
        success: false,
        message: "couldint register patient try later",
      });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("error in registerPatient in recepRoute", error);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const patientDetails = async (req, res) => {
  try {
    const findpatients = await Patient.find();
    if (!findpatients) {
      return res
        .status(200)
        .json({ success: false, message: "couldint find any patients " });
    }
    return res.status(200).json({
      success: true,
      patients: findpatients.map((p) => ({
        _id: p._id,
        name: p.name,
      })),
    });
  } catch (error) {
    console.log("error in patientDetails in recepRoute", error);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const doctorDetails = async (req, res) => {
  try {
    const findDoctors = await Doctor.find();
    if (!findDoctors) {
      return res
        .status(200)
        .json({ success: false, message: "couldint find any doctors " });
    }
    return res.status(200).json({
      success: true,
      doctors: findDoctors.map((d) => ({
        _id: d._id,
        name: d.name,
        specialization: d.specialization,
      })),
    });
  } catch (error) {
    console.log("error in doctorDetails in recepRoute", error);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const AppoinmentGenerte = async (req, res) => {
  try {
    const { patient, doctor, date, timeSlot, status } = req.body.formData;
    if (!patient && !doctor && !date && !timeSlot && !status) {
      return res
        .status(200)
        .json({ success: false, message: "please fill all the details" });
    }

    const findPatient = Patient.findOne({ _id: patient });
    const findDoctor = Doctor.findOne({ _id: doctor });

    const [patientData, doctorData] = await Promise.all([
      findPatient,
      findDoctor,
    ]);
    if (!patientData && !doctorData) {
      return res.status(200).json({
        success: false,
        message: "couldint find doctors or patients with this details",
      });
    }
    const generateAppoinment = new Appoinment({
      patient: patient,
      doctor: doctor,
      date,
      timeSlot,
      status,
    });
    const apponmentSaved = await generateAppoinment.save();
    if (!apponmentSaved) {
      return res.status(200).json({
        success: false,
        message: "couldint generate appoinment try later",
      });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("error in AppoinmentGenerte in recepRoute", error);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const getAppoinmentAndPatientList = async (req, res) => {
  try {
    const getPatients = await Patient.find();
    if (!getPatients) {
      return res
        .status(200)
        .json({ success: false, message: "couldint find any Patients" });
    }
    const getApponiments = await Appoinment.find().populate("doctor");
    if (!getApponiments) {
      return res
        .status(200)
        .json({ success: false, message: "couldint find any Appoinments" });
    }

    return res.status(200).json({
      success: true,
      appointments: getApponiments,
      patients: getPatients,
    });
  } catch (error) {
    console.log("error in getAppoinmentAndPatientList in recepRoute", error);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const pendingAppoinments = async (req, res) => {
  try {
    const getPendingAppoinments = await Appoinment.find({ status: "Pending" })
      .sort({ createdAt: -1 })
      .populate("doctor")
      .populate("patient");

    if (!getPendingAppoinments) {
      return res.status(200).json({
        success: false,
        message: "There is no pending appoiments to generate token",
      });
    }

    return res
      .status(200)
      .json({ success: true, appointments: getPendingAppoinments });
  } catch (error) {
    console.log("error in pendingAppoinments in recepRoute", error);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const generateToken = async (req, res) => {
  try {
    const appointmentId = req.body.appointmentId;
    if (!appointmentId) {
      return res
        .status(200)
        .json({ success: false, message: "server error try again later" });
    }
    const findAppoinment = await Appoinment.findOne({
      _id: appointmentId,
      status: "Pending",
    });
    if (!findAppoinment) {
      return res
        .status(200)
        .json({ success: false, message: "couldint find any appoinments" });
    }
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const latestToken = await Token.findOne({
      doctor: findAppoinment.doctor._id,
      createdAt: { $gte: todayStart },
    }).sort({ tokenNumber: -1 });

    const nextTokenNumber = latestToken ? latestToken.tokenNumber + 1 : 1;

    // Create new token
    const newToken = new Token({
      tokenNumber: nextTokenNumber,
      patient: findAppoinment.patient._id,
      doctor: findAppoinment.doctor._id,
      appoinmentId: appointmentId,
    });

    await newToken.save();


    return res.status(200).json({
      success: true,
      token: newToken.tokenNumber,
    });
  } catch (error) {
    console.log("error in getTokens in recepRoute", error);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const generatedTokens = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const filter = {
      createdAt: { $gte: fiveDaysAgo },
    };

    const totalTokens = await Token.countDocuments(filter);
    const totalPages = Math.ceil(totalTokens / limit);

    const tokens = await Token.find(filter)
      .populate("patient")
      .populate("doctor")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    if (!tokens) {
      return res.status(200).json({
        success: false,
        message: "server error try again later",
      });
    }

    return res.status(200).json({
      success: true,
      tokens,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching paginated tokens:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const cancelTokenAndAppoinment = async (req, res) => {
  try {
    const tokenId = req.query.Token;

    if (!tokenId) {
      return res.status(200).json({
        success: false,
        message: "server error try later",
      });
    }

    const findToken = await Token.findOne({ _id: tokenId });
    if (!findToken) {
      return res.status(200).json({
        success: false,
        message: "couldint find any token with this details",
      });
    }
    const updateTokenStatus = Token.findByIdAndUpdate(tokenId, {
      $set: { status: "Cancelled" },
    });
    const updateAppoinmentStatus = Appoinment.findByIdAndUpdate(
      findToken.appoinmentId,
      { $set: { status: "Cancelled" } }
    );

    const [tokenUpdate, AppoinmentUpdate] = await Promise.all([
      updateTokenStatus,
      updateAppoinmentStatus,
    ]);
    if (!tokenUpdate && !AppoinmentUpdate) {
      return res.status(200).json({
        success: false,
        message: "server error try later",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Token cancelled successfully" });
  } catch (error) {
    console.error("Error in cancelTokenAndAppoinments", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const appoinmentsAndPrescriptions = async (req, res) => {
  try {
    // const newPrescrip = await Appoinment.findOne();

    // if (newPrescrip) {
    //   const prescriptionId = new mongoose.Types.ObjectId('67fb4fb59e28184fc51bcf4d');

    //   const update = await Appoinment.updateOne(
    //     { _id: newPrescrip._id },
    //     { $set: { prescription: prescriptionId } }
    //   );

    //   console.log('Update result:', update);
    // } else {
    //   console.log('No appointment found.');
    // }

    const getAppoinments = await Appoinment.find({ status: "Completed" })
      .populate("patient")
      .populate("doctor")
      .populate({
        path: "prescription",
        populate: {
          path: "doctor", // This is the doctor field inside the prescription
          model: "Doctor", // Optional, but good practice to specify the model
        },
      });
    if (!getAppoinments) {
      return res
        .status(200)
        .json({ success: false, message: "couldint find any appoinments" });
    }
    return res
      .status(200)
      .json({ success: true, appointments: getAppoinments });
  } catch (error) {
    console.error("Error in appoinmentsAndPrescriptions", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const generateBill = async (req, res) => {
  try {
    const { consultationFee, additionalCharges, totalAmount } = req.body.formData;

    if (!consultationFee && !additionalCharges && !totalAmount) {
      return res
        .status(200)
        .json({ success: false, message: "Couldn’t find any fees" });
    }

    const { PrescriptionId } = req.params;
    if (!PrescriptionId) {
      return res
        .status(200)
        .json({ success: false, message: "Couldn’t find prescription ID" });
    }

    const findPrescription = await Prescription.findById(PrescriptionId);
    if (!findPrescription) {
      return res
        .status(200)
        .json({ success: false, message: "Couldn’t find prescription" });
    }

    const alreadyBillGenerated = await Bill.findOne({ prescription: PrescriptionId });
    if (alreadyBillGenerated) {
      return res
        .status(200)
        .json({
          success: false,
          message: "Bill is already generated for this appointment",
        });
    }

    const appointmentCount = await Appoinment.countDocuments({ patient: findPrescription.patient });

    const parsedConsultationFee = parseFloat(consultationFee) || 0;
    const parsedAdditionalCharges = parseFloat(additionalCharges) || 0;

    let tokenAmount = 0;
    if (appointmentCount === 1) {
      tokenAmount = 100;
    }

    const calculatedTotal = parsedConsultationFee + parsedAdditionalCharges + tokenAmount;

    const newbill = new Bill({
      patient: findPrescription.patient,
      doctor: findPrescription.doctor,
      consultationFee: parsedConsultationFee,
      additionalCharges: parsedAdditionalCharges,
      tokenAmount, 
      totalAmount: calculatedTotal,
      prescription: PrescriptionId,
    });

    const saveBilling = await newbill.save();
    const populatedBill = await saveBilling.populate("patient");

    return res.status(200).json({
      success: true,
      message: "Successfully bill generated",
      billing: populatedBill,
    });
  } catch (error) {
    console.error("Error in generateBill recep", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getAllBilling = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;


    const total = await Bill.countDocuments();


    const bills = await Bill.find()
      .populate("patient",) 
      .populate("doctor", ) 
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);
if(!bills){
  return res
  .status(200)
  .json({
    success: false,
    message: "No bills found",
  });
}

    return res.status(200).json({
      success: true,
      bills,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBills: total,
    });
  } catch (error) {
    console.error("Error in getAllBilling:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getDashboardData = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

  
    const totalPatients = await Patient.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

 
    const tokensIssued = await Token.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

 
    const findPendingAppointments = await Appoinment.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
      status: "Pending",
    });

    const findCompletedAppointments = await Appoinment.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
      status: "Completed",
    });

  
    const totalBillingToday = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);
    const billingTotal =
      totalBillingToday.length > 0
        ? `₹${totalBillingToday[0].totalAmount}`
        : "₹0";

  
    const upcomingAppointments = await Appoinment.find({
      date: { $gte: today },
      status: { $in: ["Pending", "Confirmed"] },
    })
      .sort({ date: 1, timeSlot: 1 })
      .limit(5)
      .populate("patient", "name")
      .populate("doctor", "name");

   
    const formattedAppointments = upcomingAppointments.map((app) => ({
      time: app.timeSlot,
      patient: app.patient?.name || "Unknown",
      doctor: app.doctor?.name || "Unknown",
      status: app.status,
    }));
    const findDoctorSignupRequest=await Doctor.countDocuments({isApproved:false})
    const totalTokens=await Token.countDocuments()

    res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        tokensIssued,
        appointments: {
          pending: findPendingAppointments,
          completed: findCompletedAppointments,
        },
        billingTotal,
      },
      DoctorSignupRequest:findDoctorSignupRequest,
      pendingAppointments: formattedAppointments,
      totalTokens,
    });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard data",
    });
  }
};
