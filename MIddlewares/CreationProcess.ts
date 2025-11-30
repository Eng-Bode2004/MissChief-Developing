import type {Request, Response, NextFunction} from "express";

export default function validateRoleCreation(req: Request, res: Response, next: NextFunction) {
    const { username, phoneNumber, Password, confirm_Password } = req.body;

    if (!username) {
        return res.status(400).json({ message: "username is required", status: 400 });
    }

    if (!phoneNumber) {
        return res.status(400).json({ message: "phoneNumber is required", status: 400 });
    }

    if (!Password) {
        return res.status(400).json({ message: "password is required", status: 400 });
    }

    if (!confirm_Password) {
        return res.status(400).json({ status: "error", message: "Please confirm the password." });
    }

    if (Password !== confirm_Password) {
        return res.status(400).json({ status: "error", message: "Passwords do not match." });
    }

    // Password policy
    const passwordPolicy = {
        minLength: 12,
        hasUpperCase: /[A-Z]/,
        hasLowerCase: /[a-z]/,
        hasNumber: /[0-9]/,
        hasSpecialChar: /[^A-Za-z0-9]/,
    };

    if (Password.length < passwordPolicy.minLength)
        return res.status(400).json({ status: "error", message: `Password must be at least ${passwordPolicy.minLength} characters long.` });
    if (!passwordPolicy.hasUpperCase.test(Password))
        return res.status(400).json({ status: "error", message: "Password must contain at least one uppercase letter." });
    if (!passwordPolicy.hasLowerCase.test(Password))
        return res.status(400).json({ status: "error", message: "Password must contain at least one lowercase letter." });
    if (!passwordPolicy.hasNumber.test(Password))
        return res.status(400).json({ status: "error", message: "Password must contain at least one number." });
    if (!passwordPolicy.hasSpecialChar.test(Password))
        return res.status(400).json({ status: "error", message: "Password must contain at least one special character (e.g., !, @, #)." });

    // Egyptian phone number validation
    const phoneString = String(phoneNumber).trim();

    if (phoneString.length !== 11) {
        return res.status(400).json({ status: "error", message: "Phone number must be exactly 11 digits long for Egyptian mobiles." });
    }

    const egyptianMobileRegex = /^(010|011|012|015)\d{8}$/;
    if (!egyptianMobileRegex.test(phoneString)) {
        return res.status(400).json({ status: "error", message: "Invalid Egyptian mobile number" });
    }

    // Validate username
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ status: "error", message: "Username can only contain letters, numbers, underscores, and dots." });
    }

    next();
}
