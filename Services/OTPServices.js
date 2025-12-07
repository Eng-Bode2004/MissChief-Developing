import OTP from "../Models/OTPSchema.js";
import User from "../Models/UserSchema.js";
import { Vonage } from '@vonage/server-sdk';

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
});

class OTPServices {

    // Generate 6-digit OTP
    generateOtpCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    // Send OTP via SMS
    async sendOtp(userId) {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        if (!user.phoneNumber) throw new Error("User phone not found");

        const otpCode = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP
        const newOtp = await OTP.create({
            User_ID: userId,
            Phone: user.phoneNumber,
            otp_code: otpCode,
            delivery_method: "sms",
            is_used: false,
            created_at: new Date(),
            expires_at: expiresAt
        });

// Send via Vonage SMS (fixed)
        const from = process.env.VONAGE_SMS_FROM;
        const to = '+2' + user.phoneNumber.replace(/^0/, ''); // convert to +2XXXXXXXXXX
        const text = `Your verification code is: ${otpCode}`;

        try {
            const response = await new Promise((resolve, reject) => {
                vonage.sms.send({ to, from, text }, (err, responseData) => {
                    if (err) return reject(err);
                    resolve(responseData);
                });
            });
            console.log("Vonage response:", response);
        } catch (err) {
            throw new Error(`Failed to send SMS via Vonage: ${err.message}`);
        }


        return {
            message: "OTP sent successfully via SMS",
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

        return this.sendOtp(userId);
    }

    // Cleanup expired OTPs
    async cleanExpiredOtps() {
        return OTP.deleteMany({ expires_at: { $lt: new Date() } });
    }
}

export default new OTPServices();
