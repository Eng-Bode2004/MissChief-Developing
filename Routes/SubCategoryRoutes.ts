import { Router } from "express";
import SubCategoryController from "../Controllers/SubCategoryController.js";

const router = Router();

// Create Sub Category
router.post("/create", SubCategoryController.createSubCategory);

// Get All Sub Categories
router.get("/all", SubCategoryController.getAllSubCategories);

// Get Sub Category by ID
router.get("/:id", SubCategoryController.getSubCategoryById);

// Delete Sub Category by ID
router.delete("/:id", SubCategoryController.deleteSubCategoryById);

// Update Sub Category by ID
router.put("/:id", SubCategoryController.updateSubCategory);

// English Sub Categories (exclude Arabic fields)
router.get("/english/all", SubCategoryController.getEnglishSubcategories);

// Arabic Sub Categories (exclude Arabic fields)
router.get("/arabic/all", SubCategoryController.getEnglishSubcategories);


export default router;
