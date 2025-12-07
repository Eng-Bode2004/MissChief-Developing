import type { Request, Response } from "express";
import SpecialityServices from "../Services/SpecialityServices.js";

class SpecialityController {

    // Create Speciality
    async createSpeciality(req: Request, res: Response) {
        try {
            const data = req.body;
            const speciality = await SpecialityServices.createSpeciality(data);

            return res.status(201).json({
                status: 201,
                message: "Speciality created successfully",
                data: speciality
            });

        } catch (error: any) {
            return res.status(400).json({
                status: 400,
                message: error.message || "Unknown error"
            });
        }
    }

    // Get All Specialities
    async getAllSpecialities(req: Request, res: Response) {
        try {
            const specialities = await SpecialityServices.getAllSpecialities();

            return res.status(200).json({
                status: 200,
                message: "All specialities retrieved successfully",
                data: specialities
            });

        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: error.message || "Unknown error"
            });
        }
    }

    // Get Speciality By ID
    async getSpecialityById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const speciality = await SpecialityServices.getSpecialityById(id);

            if (!speciality) {
                return res.status(404).json({
                    status: 404,
                    message: "Speciality not found"
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Speciality retrieved successfully",
                data: speciality
            });

        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: error.message || "Unknown error"
            });
        }
    }

    // Delete Speciality By ID
    async deleteSpecialityById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deleted = await SpecialityServices.deleteSpecialityById(id);

            if (!deleted) {
                return res.status(404).json({
                    status: 404,
                    message: "Speciality not found"
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Speciality deleted successfully"
            });

        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: error.message || "Unknown error"
            });
        }
    }

    // Update Speciality
    async updateSpeciality(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;
            const updated = await SpecialityServices.updateSpeciality(id, data);

            if (!updated) {
                return res.status(404).json({
                    status: 404,
                    message: "Speciality not found"
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Speciality updated successfully",
                data: updated
            });

        } catch (error: any) {
            return res.status(400).json({
                status: 400,
                message: error.message || "Unknown error"
            });
        }
    }

    // Get Chef's Specialities
    async getChefSpecialities(req: Request, res: Response) {
        try {
            const { chefId } = req.params;
            const specialities = await SpecialityServices.getChefSpecialities(chefId);

            return res.status(200).json({
                status: 200,
                message: "Chef specialities retrieved successfully",
                data: specialities
            });

        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: error.message || "Unknown error"
            });
        }
    }

    // Add more subcategories to chef
    async addMoreSpecialityToChef(req: Request, res: Response) {
        try {
            const { chefId } = req.params;
            const { subCategories } = req.body; // array of subCategory IDs

            const updated = await SpecialityServices.addMoreSpecialityToChef(chefId, subCategories);

            return res.status(200).json({
                status: 200,
                message: "Specialities added successfully",
                data: updated
            });

        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: error.message || "Unknown error"
            });
        }
    }

    // Delete a subcategory from chef speciality
    async deleteSubCategory(req: Request, res: Response) {
        try {
            const { chefId, subCategoryId } = req.params;

            const updated = await SpecialityServices.deleteSubCategory(chefId, subCategoryId);

            return res.status(200).json({
                status: 200,
                message: "Subcategory removed successfully",
                data: updated
            });

        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: error.message || "Unknown error"
            });
        }
    }
}

export default new SpecialityController();
