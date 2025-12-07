import OTP from "../Models/OTPSchema.js";
import User from "../Models/UserSchema.js";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

class OTPServices {

    // Generate 6-digit OTP
    generateOtpCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    // Send OTP
    async sendOtp(userId, delivery_method = "sms") {
        // Fetch user and phone
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const phone = user.phoneNumber;
        if (!phone) throw new Error("User phone not found");

        const otpCode = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        // Save OTP
        const newOtp = await OTP.create({
            User_ID: userId,
            Phone: phone,
            otp_code: otpCode,
            delivery_method,
            is_used: false,
            created_at: new Date(),
            expires_at: expiresAt
        });

        // Send SMS only if delivery method is sms
        if (delivery_method === "sms") {
            try {
                await client.messages.create({
                    body: `Your verification code is: ${otpCode}`,
                    from: process.env.TWILIO_PHONE, // your Twilio verified number
                    to: phone
                });
            } catch (err) {
                // Catch Twilio errors
                throw new Error(`Failed to send SMS: ${err.message}`);
            }
        }

        return {
            message: "OTP sent successfully",
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
        const lastOtp = await OTP.findOne({ User_ID: userId }).sort({ created_at: -1 });
        if (!lastOtp) throw new Error("No OTP to resend");

        return this.sendOtp(userId, lastOtp.delivery_method || "sms");
    }

    // Cleanup expired OTPs
    async cleanExpiredOtps() {
        return OTP.deleteMany({ expires_at: { $lt: new Date() } });
    }
}

export default new OTPServices();
