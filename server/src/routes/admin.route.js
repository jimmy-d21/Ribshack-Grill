import express from "express";
import adminAuhenticate from "../middlewares/admin.authenticate.js";
import {
  createBranch,
  deleteBranch,
  login,
  updateBranch,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Auth routes
router.post("/auth/login", login);

// Branches
router.post("/branches", adminAuhenticate, createBranch);
router.patch("/branches/:id", adminAuhenticate, updateBranch);
router.delete("/branches/:id", adminAuhenticate, deleteBranch);

export default router;
