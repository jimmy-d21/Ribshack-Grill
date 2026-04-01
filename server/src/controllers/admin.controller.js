import * as adminService from "../services/admin.service.js";
import generateTokenSetCookies from "../utils/generateTokenSetCookies.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await adminService.login(email, password);

    generateTokenSetCookies(res, user.id);

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(401).json({ message: "Login Error: " + error.message });
    console.error(error);
  }
};
