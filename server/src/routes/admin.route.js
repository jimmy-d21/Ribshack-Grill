import express from "express";
import adminAuhenticate from "../middlewares/admin.authenticate.js";
import {
  createBranch,
  login,
  updateBranch,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Auth routes
router.post("/auth/login", login);

// Branches
router.post("/branches", adminAuhenticate, createBranch);
router.patch("/branches/:id", adminAuhenticate, updateBranch);

export default router;
