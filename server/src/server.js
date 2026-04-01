import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import ENV from "./utils/ENV.js";

import adminRoutes from "./routes/admin.route.js";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.get("/", async (req, res) => {
  res.send("Welcome to Ribshack API");
});

// admin endpoint for testing database connection
app.use("/api/admin", adminRoutes);

const PORT = ENV.server.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
