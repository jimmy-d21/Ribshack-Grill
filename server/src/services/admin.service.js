import AdminModel from "../models/admin.model.js";
import BranchModel from "../models/branch.model.js";

export const login = async (email, password) => {
  const user = await AdminModel.findByEmail(email);

  const passwordMatch = user && user.password === password;

  if (!user || !passwordMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
};

export const createBranch = async (branchData) => {
  return await BranchModel.createBranch(branchData);
};

export const updateBranch = async (id, branchData) => {
  if (branchData.password) {
    return await BranchModel.updateBranchWithPassword(id, branchData);
  } else {
    return await BranchModel.updateBranchWithoutPassword(id, branchData);
  }
};
