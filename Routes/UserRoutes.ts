
// import Controller
import UserControllers from "../Controllers/UserControllers.ts";

// import Middleware
import CreationProcess from "../MIddlewares/CreationProcess.js"
import express from "express";

const router = express.Router();

                                        // Routes
router.post('/register', CreationProcess,UserControllers.createUser);






export default router;
