import express from "express";
import adminAuhenticate from "../middlewares/admin.authenticate.js";
import {
  approveInventoryRequest,
  createBranch,
  createProduct,
  declinedInventoryRequest,
  deleteBranch,
  deleteProduct,
  getAllBranches,
  getAllRequestInventory,
  login,
  updateBranch,
  updateProduct,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Auth routes
router.post("/auth/login", login);

// Branches routes
router.get("/branches", adminAuhenticate, getAllBranches);
router.post("/branches", adminAuhenticate, createBranch);
router.patch("/branches/:id", adminAuhenticate, updateBranch);
router.delete("/branches/:id", adminAuhenticate, deleteBranch);

// Products routes
router.post("/products", adminAuhenticate, createProduct);
router.patch("/products/:id", adminAuhenticate, updateProduct);
router.delete("/products/:id", adminAuhenticate, deleteProduct);

// Invernotory routes
router.get("/inventory", adminAuhenticate, getAllRequestInventory);
router.patch(
  "/inventory/approve/:id",
  adminAuhenticate,
  approveInventoryRequest,
);
router.patch(
  "/inventory/declined/:id",
  adminAuhenticate,
  declinedInventoryRequest,
);

export default router;
