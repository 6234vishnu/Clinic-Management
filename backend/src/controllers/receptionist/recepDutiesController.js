import Doctor from "../../models/doctorSchema.js"

export const unApprovedDoctors=async(req,res)=>{
    
    try {
        const findUnapprovedDocs=await Doctor.find({isApproved:false})
        
        if(!findUnapprovedDocs){
            return res.status(200).json({success:false,message:"no new signUp to approve"})
        }
        return res.status(200).json({success:true,doctor:findUnapprovedDocs})
    } catch (error) {
        return res.status(500).json({success:false,message:"server error"})
    }
}