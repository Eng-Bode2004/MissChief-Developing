import OTP from "../Models/OTPSchema.js";
import User from "../Models/UserSchema.js";
import fetch from "node-fetch"; // install with `npm install node-fetch@2` for Node.js <18
import "dotenv/config";

const VONAGE_API_KEY = process.env.VONAGE_API_KEY;
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET;
const VONAGE_WHATSAPP_FROM = process.env.VONAGE_SMS_FROM; // Your WhatsApp-enabled number

class OTPServices {

    // Generate 6-digit OTP
    generateOtpCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    // Send OTP via WhatsApp
    async sendOtp(userId) {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        if (!user.phoneNumber) throw new Error("User phone not found");

        const otpCode = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP to DB
        const newOtp = await OTP.create({
            User_ID: userId,
            Phone: user.phoneNumber,
            otp_code: otpCode,
            delivery_method: "whatsapp",
            is_used: false,
            created_at: new Date(),
            expires_at: expiresAt
        });

        // Format phone to E.164
        const to = '+2' + user.phoneNumber.replace(/^0/, '');
        const from = VONAGE_WHATSAPP_FROM;
        const text = `Your verification code is: ${otpCode}`;

        // Send WhatsApp via Vonage Messages API
        try {
            const response = await fetch("https://messages-sandbox.nexmo.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Basic " + Buffer.from(`${VONAGE_API_KEY}:${VONAGE_API_SECRET}`).toString("base64")
                },
                body: JSON.stringify({
                    from,
                    to,
                    message_type: "text",
                    text,
                    channel: "whatsapp"
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(JSON.stringify(data));

            console.log("WhatsApp OTP sent:", data);
        } catch (err) {
            throw new Error(`Failed to send WhatsApp OTP via Vonage: ${err.message}`);
        }

        return {
            message: "OTP sent successfully via WhatsApp",
            otp_id: newOtp._id,
            expires_at: expiresAt
        };
    }

    // Verify OTP
    async verifyOtp(userId, otpCode) {
        const otp = await OTP.findOne({
            User_ID: userId,
            otp_code: otpCode,
            is_used: false
        });

        if (!otp) throw new Error("Invalid OTP");
        if (otp.expires_at < new Date()) throw new Error("OTP expired");

        otp.is_used = true;
        await otp.save();

        await User.findByIdAndUpdate(userId, { isPhoneVerified: true });

        return { message: "OTP verified successfully" };
    }

    // Resend OTP
    async resendOtp(userId) {
        return this.sendOtp(userId);
    }

    // Cleanup expired OTPs
    async cleanExpiredOtps() {
        return OTP.deleteMany({ expires_at: { $lt: new Date() } });
    }
}

export default new OTPServices();
