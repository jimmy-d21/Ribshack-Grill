import bcrypt from "bcryptjs";
import AdminModel from "../models/admin.model.js";
import BranchModel from "../models/branch.model.js";
import ProductModel from "../models/product.model.js";

export const login = async (email, password) => {
  const user = await AdminModel.findByEmail(email);

  const passwordMatch = user && user.password === password;

  if (!user || !passwordMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
};

export const createBranch = async (branchData) => {
  const hashedPassword = await bcrypt.hash(branchData.password, 10);
  branchData.password = hashedPassword;
  return await BranchModel.createBranch(branchData);
};

export const updateBranch = async (id, branchData) => {
  const branch = await BranchModel.findBranchById(id);
  if (!branch) {
    throw new Error("Branch not found");
  }
  if (branchData.password) {
    const hashedPassword = await bcrypt.hash(branchData.password, 10);
    branchData.password = hashedPassword;
    return await BranchModel.updateBranchWithPassword(branch.id, branchData);
  } else {
    return await BranchModel.updateBranchWithoutPassword(branch.id, branchData);
  }
};

export const deleteBranch = async (id) => {
  const branch = await BranchModel.findBranchById(id);
  if (!branch) {
    throw new Error("Branch not found");
  }
  return await BranchModel.deleteBranch(id);
};

export const createProduct = async (productData) => {
  return await ProductModel.createProducts(productData);
};

export const updateProduct = async (id, productData) => {
  const product = await ProductModel.findProductById(id);
  if (!product) {
    throw new Error("Product not found");
  }

  return await ProductModel.updateProduct(id, productData);
};

export const deleteProduct = async (id) => {
  const product = await ProductModel.findProductById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  await ProductModel.deleteProduct(id);
};
