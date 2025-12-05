
// import Controller
import UserControllers from "../Controllers/UserControllers.ts";

// import Middleware
import RegisterUser from "../Middlewares/RegisterUser.ts"
import AssigningRole from "../Middlewares/Assigning-Role.ts"

import express from "express";

const router = express.Router();

                                        // Routes
router.post('/register', RegisterUser,UserControllers.createUser);
router.put('/:userId/assign-role',AssigningRole,UserControllers.AssignRole);





export default router;
