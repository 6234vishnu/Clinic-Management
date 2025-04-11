import Doctor from "../../models/doctorSchema.js";
import Patient from "../../models/patientSchema.js";
import Appoinment from "../../models/appoinmentSchema.js";
import Token from "../../models/tokenSchema.js";

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
    const getPendingAppoinments = await Appoinment.find({ status: "Pending" }).sort({ createdAt: -1 })
      .populate("doctor")
      .populate("patient");

    if (!getPendingAppoinments) {
      return res
        .status(200)
        .json({
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


export const generateToken=async(req,res)=>{
  try {
    
    const appointmentId=req.body.appointmentId
    if(!appointmentId){
      return res.status(200).json({success:false,message:"server error try again later"})
    }
    const findAppoinment=await Appoinment.findOne({_id:appointmentId,status:"Pending"})
    if(!findAppoinment){
      return res.status(200).json({success:false,message:"couldint find any appoinments"})
      
    }
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const latestToken = await Token.findOne({
      doctor: findAppoinment.doctor._id,
      createdAt: { $gte: todayStart }
    }).sort({ tokenNumber: -1 });

    const nextTokenNumber = latestToken ? latestToken.tokenNumber + 1 : 1;

    // Create new token
    const newToken = new Token({
      tokenNumber: nextTokenNumber,
      patient: findAppoinment.patient._id,
      doctor: findAppoinment.doctor._id,
    });

    await newToken.save();

   
    findAppoinment.status = "Completed";
    await findAppoinment.save();

    return res.status(200).json({
      success: true,
      token: newToken.tokenNumber,
     
    });
  } catch (error) {
    
  }
}