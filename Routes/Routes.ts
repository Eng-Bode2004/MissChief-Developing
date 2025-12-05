import express from 'express';

// Controller
import RoleControllers from "../Controllers/RoleControllers.ts";



// Router
const router = express.Router();

// Routes
router.post("/", RoleControllers.createRole);

router.get("/", RoleControllers.getAllRoles);

router.get("/:id", RoleControllers.getRoleById);

router.patch("/:id", RoleControllers.updateRole);

router.patch("/:id/arabic", RoleControllers.updateRoleArabicDescription);

router.patch("/:id/english", RoleControllers.updateRoleEnglishDescription);

router.delete("/:id", RoleControllers.deleteRoleById);

export default router;

