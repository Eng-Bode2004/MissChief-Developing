import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
    User_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    Phone: {
        type: String,
    },
    otp_code: {
        type: Number,
        required: true,
        min: 1000,
        max: 999999
    },
    is_used: {
        type: Boolean,
        default: false
    },
    delivery_method: {
        type: String,
        enum: ["sms", "email", "whatsapp"],
    },

    created_at: {
        type: Date,
        default: Date.now
    },
    expires_at: {
        type: Date,
        required: true
    }
});

// Optional indexes
OTPSchema.index({ User_ID: 1, otp_code: 1 }); // For fast searching
OTPSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });  // Delete otp after reach to expires date

export default mongoose.model("OTP", OTPSchema);
