import UserSchema from "../Models/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthServices {

    generateAccessToken(user) {
        return jwt.sign(
            {
                userId: user._id,
                username: user.username,
                phoneNumber: user.phoneNumber,
                isPhoneVerified: user.isPhoneVerified,
                Profile: user.Profile,
                Role: user.Role,
                language: user.language
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );
    }

    generateRefreshToken(user) {
        return jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );
    }

    async login(identifier, password) {
        // Login by username or phoneNumber
        const user = await UserSchema.findOne({
            $or: [
                { phoneNumber: identifier },
                { username: identifier }
            ]
        });

        if (!user) throw new Error("User not found");

        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) throw new Error("Invalid password");

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        // Save refresh token in DB
        user.refreshToken = refreshToken;
        await user.save();

        return {
            accessToken,
            refreshToken,
            user: {
                username: user.username,
                phoneNumber: user.phoneNumber,
                isPhoneVerified: user.isPhoneVerified,
                Profile: user.Profile,
                Role: user.Role,
                language: user.language
            }
        };
    }

    async logout(userId) {
        const user = await UserSchema.findById(userId);
        if (!user) throw new Error("User not found");

        user.refreshToken = null;
        await user.save();

        return { message: "Logged out successfully" };
    }
}

export default new AuthServices();
