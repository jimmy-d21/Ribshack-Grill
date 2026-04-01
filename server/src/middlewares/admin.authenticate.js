import jwt from "jsonwebtoken";
import AdminModel from "../models/admin.model.js";
import ENV from "../utils/ENV.js";

const adminAuthenticate = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, ENV.jwtSecret);

    const admin = await AdminModel.findByAdminId(decoded.userId);

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized: Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default adminAuthenticate;
