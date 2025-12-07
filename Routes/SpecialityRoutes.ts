import { Router } from "express";
import SpecialityController from "../Controllers/SpecialityController.js";

const router = Router();

// Create a new Speciality
router.post("/", SpecialityController.createSpeciality);

// Get all Specialities
router.get("/", SpecialityController.getAllSpecialities);

// Get Speciality by ID
router.get("/:id", SpecialityController.getSpecialityById);

// Update Speciality by ID
router.put("/:id", SpecialityController.updateSpeciality);

// Delete Speciality by ID
router.delete("/:id", SpecialityController.deleteSpecialityById);

// Get all Specialities for a specific chef
router.get("/chef/:chefId", SpecialityController.getChefSpecialities);

// Add more subcategories to a chef's Speciality
router.patch("/chef/:chefId/add", SpecialityController.addMoreSpecialityToChef);

// Delete a subcategory from a chef's Speciality
router.delete("/chef/:chefId/subcategory/:subCategoryId", SpecialityController.deleteSubCategory);

// Assign a chef profile to a speciality
router.post("/assign-profile/:specialityId", SpecialityController.assignProfile);

export default router;
