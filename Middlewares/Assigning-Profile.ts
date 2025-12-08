import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import UserSchema from "../Models/UserSchema.ts";

interface CustomRequest extends Request {
    ProfileId?: string;
    user?: any; // adjust type based on your User model
}

export default async function validateAssignProfile(
    req: CustomRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const { ProfileId } = req.body; // expecting { ProfileId: "...objectId..." }
        const { userId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid or missing user ID",
            });
        }

        if (!ProfileId || !mongoose.Types.ObjectId.isValid(ProfileId)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid or missing Profile ID",
            });
        }

        // Fetch the user
        const user = await UserSchema.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        // Check if profile is already assigned
        if (user.Profile && user.Profile.toString() === ProfileId) {
            return res.status(400).json({
                status: "error",
                message: "Profile already assigned to this user",
            });
        }
        // Check if any profile is already assigned
        if (user.Profile) {
            return res.status(400).json({
                status: "error",
                message: "A profile is already assigned to this user. Cannot assign another.",
            });
        }

        // Attach to request for controller
        req.ProfileId = ProfileId;
        req.user = user;

        next();
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message || "Server error",
        });
    }
}
