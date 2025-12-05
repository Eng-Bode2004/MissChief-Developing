import type { Request, Response, NextFunction } from "express";
import UserSchema from "../Models/UserSchema.ts";

interface RegisterBody {
    username: string;
    phoneNumber?: string | number;
    password: string;
    confirmPassword: string;
    RoleId?: string;
    roleId?: string;
}

interface CustomRequest extends Request {
    RoleId?: string;
    user?: any; // adjust type based on your User model
}

export default async function validateUserRegistration(
    req: CustomRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const { RoleId, roleId } = req.body;
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                status: "error",
                message: "User ID not provided",
            });
        }

        if (!RoleId && !roleId) {
            return res.status(400).json({
                status: "error",
                message: "Role ID not provided",
            });
        }

        const idToUse = RoleId || roleId;

        const user = await UserSchema.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        if (user.Role && user.Role.toString() === idToUse) {
            return res.status(400).json({
                status: "error",
                message: "Role already assigned to this user",
            });
        }

        req.RoleId = idToUse;
        req.user = user;

        next(); // call next only once after successful validation
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}
