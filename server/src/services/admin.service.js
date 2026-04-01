import AdminModel from "../models/admin.model.js";

export const login = async (email, password) => {
  const user = await AdminModel.findByEmail(email);

  const passwordMatch = user && user.password === password;

  if (!user || !passwordMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
};
