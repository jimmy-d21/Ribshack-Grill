import jwt from "jsonwebtoken";
import ENV from "./ENV.js";

const generateTokenSetCookies = (res, userId) => {
  const token = jwt.sign({ userId }, ENV.jwtSecret, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: ENV.server.secure, // Ensure this is false in local development
    sameSite: "Lax", // Changed from Strict to Lax for easier local testing
    maxAge: 3600000,
  });
};

export default generateTokenSetCookies;
