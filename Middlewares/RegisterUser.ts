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
            message: 'الرجاء إدخال اسم المستخدم',
        });
    }

    if(!phoneNumber) {
        return res.status(400).json({
            status: 'error',
            message: 'الرجاء إدخال رقم الهاتف',
        })
    }

    if(!password) {
        return res.status(400).json({
            status: 'error',
            message: 'الرجاء إدخال كلمة المرور',
        })
    }

    if (!confirmPassword) {
        return res.status(400).json({
            status: 'error',
            message: 'الرجاء إدخال تأكيد كلمة المرور',
        })
    }


                                     // Check if Passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({
            status: "error",
            message: "كلمات المرور غير متطابقة"
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
            message: ` يجب أن تكون كلمة المرور على الأقل ${passwordPolicy.minLength} أحرف.`
        });

    if (!passwordPolicy.hasUpperCase.test(password))
        return res.status(400).json({
            status: "error",
            message: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل"
        });

    if (!passwordPolicy.hasLowerCase.test(password))
        return res.status(400).json({
            status: "error",
            message: "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل"
        });

    if (!passwordPolicy.hasNumber.test(password))
        return res.status(400).json({
            status: "error",
            message: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل"
        });





    // Validate Username
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({
            status: "error",
            message: "يجب أن يحتوي اسم المستخدم فقط على أحرف وأرقام وعلامات سفلية ونقاط"
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
                message: 'يجب أن يتكون رقم الهاتف المحمول المصري من 11 رقمًا بالضبط',
            });
        }

        // 2. Check for starting prefixes (010, 011, 012, 015)
        const egyptianMobileRegex = /^(010|011|012|015)\d{8}$/;

        if (!egyptianMobileRegex.test(phoneString)) {
            return res.status(400).json({
                status: 'error',
                message: 'رقم جوال مصري غير صحيح. يجب أن يبدأ بـ ٠١٠، ٠١١، ٠١٢، أو ٠١٥',
            });
        }
    }



    next();
}
