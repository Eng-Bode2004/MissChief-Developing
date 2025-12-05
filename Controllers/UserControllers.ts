import type {Request, Response} from "express";
import UserServices from "../Services/UserServices";

class UserControllers {

    async createUser(req: Request, res: Response) {
        try {
            const userData = req.body;
            const newUser = await UserServices.createUser(userData);

            return res.status(201).json({
                message: "User created successfully",
                user: newUser,
                status: 201
            });

        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({
                    message: error.message,
                    status: 400
                });
            } else {
                res.status(400).json({
                    message: "Unknown error occurred",
                    status: 400
                });
            }
        }
    }

    async AssignRole(req:Request, res: Response) {
        try {
            const { RoleId } = req.body;
            const { userId } = req.params;

            const UserRole = await UserServices.AssignRole(userId, RoleId);

            res.status(200).json({
                status: "success",
                message: "Role assigned successfully",
                data: UserRole
            });
        } catch (error: unknown ) {

            if (error instanceof Error) {
                res.status(400).json({
                    message: error.message,
                    status: 400
                });
            } else {
                res.status(400).json({
                    message: "Unknown error occurred",
                    status: 400
                });
            }


        }
    }



}

export default new UserControllers();
