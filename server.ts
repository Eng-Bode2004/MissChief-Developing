import "dotenv/config";
import express from "express";
import "./Config/DataBase.js";
import ImagesRoutes from "./Routes/ImagesRoutes.ts";
// Initialize Express
const app = express();

// Middleware


// Routes
app.use("/api/v2/images", ImagesRoutes);
app.use(express.json());

// Start Server
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
