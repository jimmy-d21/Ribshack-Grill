import express from "express";
import cors from "cors";

import ENV from "./utils/ENV.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("Hello World");
});
const PORT = ENV.server.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
