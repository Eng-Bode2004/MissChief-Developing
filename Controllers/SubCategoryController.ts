import type {Request,Response} from "express";
import SubCategoryServices from "../Services/SubCategoryServices.js";

class SubCategoryController {

    // Create Sub Category
    async createSubCategory(req:Request, res:Response) {
        try {
            const data = req.body;
            const result = await SubCategoryServices.createSubCategory(data);

            return res.status(201).json({
                status: 201,
                message: "Sub Category created successfully",
                data: result
            });
        } catch (error:unknown) {


            return res.status(400).json({
                status: 400,
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    // Get All Sub Categories
    async getAllSubCategories(req:Request, res:Response) {
        try {
            const categories = await SubCategoryServices.getAllSubCategories();
            return res.status(200).json({
                status: 200,
                message: "All sub categories retrieved successfully",
                data: categories
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    // Get Sub Category by ID
    async getSubCategoryById(req:Request, res:Response) {
        try {
            const { id } = req.params;
            const category = await SubCategoryServices.getSubCategoryById(id);

            if (!category) {
                return res.status(404).json({
                    status: 404,
                    message: "Sub Category not found"
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Sub Category retrieved successfully",
                data: category
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    // Delete Sub Category by ID
    async deleteSubCategoryById(req:Request, res:Response) {
        try {
            const { id } = req.params;
            const deleted = await SubCategoryServices.deleteSubCategoryById(id);

            if (!deleted) {
                return res.status(404).json({
                    status: 404,
                    message: "Sub Category not found"
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Sub Category deleted successfully"
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    // Update Sub Category
    async updateSubCategory(req:Request, res:Response) {
        try {
            const { id } = req.params;
            const data = req.body;

            const updated = await SubCategoryServices.updateSubCategory(id, data);

            if (!updated) {
                return res.status(404).json({
                    status: 404,
                    message: "Sub Category not found"
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Sub Category updated successfully",
                data: updated
            });

        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    // English Sub Categories (excluding Arabic fields)
    async getEnglishSubcategories(req:Request, res:Response) {
        try {
            const englishCategories = await SubCategoryServices.getEnglishSubcategories();

            return res.status(200).json({
                status: 200,
                message: "English sub categories retrieved successfully",
                data: englishCategories
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

    // English Sub Categories (excluding Arabic fields)
    async getArabicSubcategories(req:Request, res:Response) {
        try {
            const arabicCategories = await SubCategoryServices.getArabicSubcategories();

            return res.status(200).json({
                status: 200,
                message: "Arabic sub categories retrieved successfully",
                data: arabicCategories
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }

}

export default new SubCategoryController();
