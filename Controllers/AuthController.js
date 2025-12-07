import AuthServices from "../Services/AuthServices.js";

class AuthController {
    async login(req, res) {
        try {
            const { phoneNumber, password } = req.body;

            if (!phoneNumber || !password) {
                return res.status(400).json({
                    status: "error",
                    message: "phoneNumber and password are required"
                });
            }

            const result = await AuthServices.login(phoneNumber, password);

            res.status(200).json({
                status: "success",
                ...result
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
                message: error.message
            });
        }
    }
}

export default new AuthController();
