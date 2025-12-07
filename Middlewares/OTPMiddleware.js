import User from "../Models/UserSchema.js";
import OTP from "../Models/OTPSchema.js";

class OTPMiddleware {

    async validatePhoneForSend(req, res, next) {
        try {
            const { userId } = req.body;
            if (!userId) return res.status(400).json({ status: "error", message: "userId is required" });

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ status: "error", message: "User not found" });
            if (!user.phoneNumber) return res.status(400).json({ status: "error", message: "User does not have a phone number registered" });

            req.body.phone = user.phoneNumber;

            // Rate limit: 1 OTP per 30 seconds
            const lastOtp = await OTP.findOne({ User_ID: userId }).sort({ created_at: -1 });
            if (lastOtp && (Date.now() - lastOtp.created_at) / 1000 < 30) {
                return res.status(429).json({
                    status: "error",
                    message: `Please wait ${30 - Math.floor((Date.now() - lastOtp.created_at) / 1000)} seconds before requesting another OTP`
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    }
}

export default new OTPMiddleware();
