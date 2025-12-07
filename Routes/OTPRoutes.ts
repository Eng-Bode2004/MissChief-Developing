import express from "express";
import OTPController from "../Controllers/OTPController.js";
import OTPMiddleware from "../Middlewares/OTPMiddleware.js";

const router = express.Router();

router.post("/send", OTPMiddleware.validatePhoneForSend, OTPController.send);
router.post("/verify", OTPController.verify);
router.post("/resend", OTPController.resend);
router.delete("/clean", OTPController.clean);

export default router;
