import OTPServices from "../Services/OTPServices.js";

class OTPController {

    async send(req, res) {
        try {
            const { userId, delivery_method } = req.body;

            const result = await OTPServices.sendOtp(
                userId,
                delivery_method || "sms"
            );

            res.status(200).json({
                status: "success",
                ...result
            });

        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    }

    async verify(req, res) {
        try {
            const { userId, otp_code } = req.body;

            const result = await OTPServices.verifyOtp(userId, otp_code);

            res.status(200).json({
                status: "success",
                ...result
            });

        } catch (error) {
            res.status(400).json({
                status: "error",
                message: error.message
            });
        }
    }

    async resend(req, res) {
        try {
            const { userId } = req.body;

            const result = await OTPServices.resendOtp(userId);

            res.status(200).json({
                status: "success",
                ...result
            });

        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    }

    async clean(req, res) {
        try {
            const result = await OTPServices.cleanExpiredOtps();

            res.status(200).json({
                status: "success",
                deleted: result.deletedCount
            });

        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message
            });
        }
    }
}

export default new OTPController();
