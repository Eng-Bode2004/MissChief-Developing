import AuthServices from "../Services/AuthServices.js";

class AuthController {
    async login(req, res) {
        try {
            const { identifier, password } = req.body;

            if (!identifier || !password) {
                return res.status(400).json({
                    status: "error",
                    message: "username or phoneNumber and password are required"
                });
            }

            const result = await AuthServices.login(identifier, password);

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

    async logout(req, res) {
        try {
            const { userId }  = req.params;

            if (!userId) {
                return res.status(400).json({
                    status: "error",
                    message: "userId is required"
                });
            }

            const result = await AuthServices.logout(userId);

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
