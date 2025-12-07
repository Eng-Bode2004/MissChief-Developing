import UserSchema, { IUser } from "../Models/UserSchema.ts"; // assuming you export IUser interface from your model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    user: Partial<IUser>;
}

class AuthServices {

    // Generate JWT Access Token
    generateAccessToken(user: IUser): string {
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
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: "15m" }
    );
    }

    // Generate JWT Refresh Token
    generateRefreshToken(user: IUser): string {
        return jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: "7d" }
    );
    }

    // User login
    async login(phoneNumber: string, password: string): Promise<AuthTokens> {
        // Find user by phoneNumber and populate references
        const user = await UserSchema.findOne({ phoneNumber }).populate("Profile Role") as IUser | null;

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
