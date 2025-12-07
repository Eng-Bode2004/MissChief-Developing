import "dotenv/config";
import express from "express";
import "./Config/DataBase.js";
import OTPRoutes from "./Routes/OTPRoutes.ts";

// Initialize Express
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/otp", OTPRoutes);

// Start Server
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
