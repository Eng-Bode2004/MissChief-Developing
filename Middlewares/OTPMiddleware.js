import User from "../Models/UserSchema.js";
import OTP from "../Models/OTPSchema.js";

class OTPMiddleware {

    async validatePhoneForSend(req, res, next) {
        try {
            const { userId, phone } = req.body;

            if (!userId || !phone) {
                return res.status(400).json({
                    status: "error",
                    message: "userId and phone are required"
                });
            }

            // Check user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    status: "error",
                    message: "User not found"
                });
            }

            // Ensure phone matches user registered phone
            if (user.phoneNumber !== phone) {
                return res.status(400).json({
                    status: "error",
                    message: "Phone number does not match user"
                });
            }

            // Rate limit: wait 30 sec before requesting another OTP
            const lastOtp = await OTP.findOne({ User_ID: userId })
                .sort({ created_at: -1 });

            if (lastOtp) {
                const secondsPassed =
                    (Date.now() - lastOtp.created_at) / 1000;

                if (secondsPassed < 30) {
                    return res.status(429).json({
                        status: "error",
                        message: `Please wait ${30 - Math.floor(secondsPassed)} seconds before requesting another OTP`
                    });
                }
            }

            next();

        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    }
}

export default new OTPMiddleware();
