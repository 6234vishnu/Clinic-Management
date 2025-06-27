import mongoose from "mongoose";
const connectDB=async()=>{
    try {
        const connect=await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        if(!connect){
           console.log(" MongoDB Connection Failed");
           
        }
        console.log('mongodb connected');
        
    } catch (error) {
        console.error(" MongoDB Connection Failed", error);
        process.exit(1);
    }
}

export default connectDB
