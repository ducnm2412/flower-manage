import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import "./config/firebase.js";
import flowerRoutes from "./routes/flowerRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://flower-manage.vercel.app"],
    credentials: true,
  }),
);


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Auth routes
app.use("/auth", authRoutes);

// Flower routes
app.use("/flowers", flowerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
