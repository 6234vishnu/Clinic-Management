import jwt from "jsonwebtoken";

const verifyReceptionistToken = (req, res, next) => {
  try {
    const token = req.cookies.authTokenRecep;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // must match your token generation
    req.receptionistId = decoded.id; // Attach receptionist ID to request
    next();
  } catch (err) {
    console.log("Receptionist token verification failed:", err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

export default verifyReceptionistToken;
