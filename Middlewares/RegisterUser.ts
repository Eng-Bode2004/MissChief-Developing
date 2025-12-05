import type { Request, Response, NextFunction } from "express";

interface RegisterBody {
    username: string;
    phoneNumber?: string | number;
    password: string;
    confirmPassword: string;
}

export default function validateUserRegistration(
    req: Request<{}, {}, RegisterBody>,
    res: Response,
    next: NextFunction
)

{


    const { username, phoneNumber, password, confirmPassword } = req.body;

    // Check if Data exists
    if (!username) {
        return res.status(400).json({
            status: 'error',
            message: 'Please enter username.',
        });
    }

    if(!phoneNumber) {
        return res.status(400).json({
            status: 'error',
            message: 'Please enter phone number.',
        })
    }

    if(!password) {
        return res.status(400).json({
            status: 'error',
            message: 'Please enter password',
        })
    }

    if (!confirmPassword) {
        return res.status(400).json({
            status: 'error',
            message: 'Please enter confirm password',
        })
    }


                                     // Check if Passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({
            status: "error",
            message: "Passwords do not match."
        });
    }


                       // Check if Passwords Strong
    const passwordPolicy = {
        minLength: 8,
        hasUpperCase: /[A-Z]/,
        hasLowerCase: /[a-z]/,
        hasNumber: /[0-9]/,
    };

    if (password.length < passwordPolicy.minLength)
        return res.status(400).json({
            status: "error",
            message: `Password must be at least ${passwordPolicy.minLength} characters long.`
        });

    if (!passwordPolicy.hasUpperCase.test(password))
        return res.status(400).json({
            status: "error",
            message: "Password must contain at least one uppercase letter."
        });

    if (!passwordPolicy.hasLowerCase.test(password))
        return res.status(400).json({
            status: "error",
            message: "Password must contain at least one lowercase letter."
        });

    if (!passwordPolicy.hasNumber.test(password))
        return res.status(400).json({
            status: "error",
            message: "Password must contain at least one number."
        });





    // Validate Username
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({
            status: "error",
            message: "Username can only contain letters, numbers, underscores, and dots."
        });
    }






    // Validate phone number
    // D. Egyptian Phone Number Validation (if provided)
    if (phoneNumber) {
        const phoneString = String(phoneNumber).trim();

        // 1. Check for 11 digits
        if (phoneString.length !== 11) {
            return res.status(400).json({
                status: 'error',
                message: 'Phone number must be exactly 11 digits long for Egyptian mobiles.',
            });
        }

        // 2. Check for starting prefixes (010, 011, 012, 015)
        const egyptianMobileRegex = /^(010|011|012|015)\d{8}$/;

        if (!egyptianMobileRegex.test(phoneString)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid Egyptian mobile number. Must start with 010, 011, 012, or 015.',
            });
        }
    }



    next();
}
