import express from "express";
import { login } from "../controllers/admin.controller.js";

const router = express.Router();

// Auth routes
router.post("/auth/login", login);

export default router;
