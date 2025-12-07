import UserSchema from "../Models/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthServices {

    // Generate JWT Access Token
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
            { expiresIn: "15m" } // Access token valid for 15 min
        );
    }

    // Generate JWT Refresh Token
    generateRefreshToken(user) {
        return jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" } // Refresh token valid for 7 days
        );
    }

    // User login by phoneNumber or username
    async login(identifier, password) {
        // Find user by phoneNumber or username
        const user = await UserSchema.findOne({
            $or: [
                { phoneNumber: identifier },
                { username: identifier }
            ]
        }).populate("Profile Role");

        if (!user) {
            throw new Error("User not found");
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) {
            throw new Error("Invalid password");
        }

        // Generate tokens
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

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
}

export default new AuthServices();
