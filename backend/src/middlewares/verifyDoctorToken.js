import jwt from "jsonwebtoken";

const verifyDoctorToken = (req, res, next) => {
  try {
    const token = req.cookies.authTokenDoc;

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.doctorId = decoded.id; 
    next();
  } catch (err) {
    console.log("Token verification failed:", err);
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export default verifyDoctorToken;
