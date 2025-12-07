import UserSchema from "../Models/UserSchema.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthServices {
    generateAccessToken(user: any) {
        return jwt.sign(
            {
                userId: user._id,
                username: user.username,
                phoneNumber: user.phoneNumber,
                isPhoneVerified: user.isPhoneVerified,
                Password: user.Password,
                Profile: user.Profile,
                Role: user.Role,
                language: user.language
            },
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: "15m" } // Access token valid 15 min
        );
    }

    generateRefreshToken(user: any) {
        return jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: "7d" } // Refresh token valid 7 days
        );
    }

    async login(phoneNumber: string, password: string) {
        const user = await UserSchema.findOne({ phoneNumber })
            .populate("Profile Role");

        if (!user) throw new Error("User not found");

        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) throw new Error("Invalid password");

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        return {
            accessToken,
            refreshToken,
            user: {
                username: user.username,
                phoneNumber: user.phoneNumber,
                isPhoneVerified: user.isPhoneVerified,
                Password: user.Password,
                Profile: user.Profile,
                Role: user.Role,
                language: user.language
            }
        };
    }
}

export default new AuthServices();
