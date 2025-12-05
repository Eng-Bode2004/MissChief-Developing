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

// Exclude a specific role ID
router.get("/except/:excludedId", RoleControllers.getRolesExcept);

// Get Arabic roles excluding a specific ID
router.get("/arabic/:excludedId", RoleControllers.getArabicRoles);

// Get English roles excluding a specific ID
router.get("/english/:excludedId", RoleControllers.getEnglishRoles);

export default router;

