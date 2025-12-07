import OTP from "../Models/OTPSchema.js";
import User from "../Models/UserSchema.js";
import twilio from "twilio";

const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH
);

class OTPServices {

    generateOtpCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    // Convert Egyptian numbers to +20 format
    formatPhoneNumber(phone) {
        let p = phone.replace(/\s|-/g, ""); // remove spaces/dashes

        if (p.startsWith("0")) p = p.substring(1);   // remove leading 0
        if (!p.startsWith("+")) p = "+20" + p;       // add +20

        return p;
    }

    // Send OTP
    async sendOtp(userId, delivery_method = "sms") {

        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        let phone = this.formatPhoneNumber(user.phoneNumber);

        const otpCode = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const newOtp = await OTP.create({
            User_ID: userId,
            Phone: phone,
            otp_code: otpCode,
            delivery_method,
            is_used: false,
            created_at: new Date(),
            expires_at: expiresAt
        });

        if (delivery_method === "sms") {
            await client.messages.create({
                body: `Your verification code is: ${otpCode}`,
                from: process.env.TWILIO_PHONE,
                to: phone
            });
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

        await User.findByIdAndUpdate(userId, {
            isPhoneVerified: true,
        });

        return { message: "OTP verified successfully" };
    }

    // Resend last OTP
    async resendOtp(userId) {

        const lastOtp = await OTP.findOne({ User_ID: userId })
            .sort({ created_at: -1 });

        if (!lastOtp) throw new Error("No OTP to resend");

        return this.sendOtp(
            userId,
            lastOtp.delivery_method || "sms"
        );
    }

    async cleanExpiredOtps() {
        return OTP.deleteMany({
            expires_at: { $lt: new Date() }
        });
    }
}

export default new OTPServices();
