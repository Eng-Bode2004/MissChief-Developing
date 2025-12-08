
// import Controller
import UserControllers from "../Controllers/UserControllers.ts";

// import Middleware
import RegisterUser from "../Middlewares/RegisterUser.ts"
import AssigningRole from "../Middlewares/Assigning-Role.ts"
import AssigningProfile from "../Middlewares/Assigning-Profile.ts"
import AuthController from "../Controllers/AuthController.js";
import express from "express";

const router = express.Router();

                                        // Routes
router.post('/register', RegisterUser,UserControllers.createUser);
router.put('/:userId/assign-role',AssigningRole,UserControllers.AssignRole);
router.put('/:userId/assign-profile',AssigningProfile,UserControllers.AssignProfile);
router.post("/login", AuthController.login);

// Logout
router.post("/logout/:userId", AuthController.logout);



export default router;
