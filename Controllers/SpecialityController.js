import SpecialityServices from "../Services/SpecialityServices.js";

class SpecialityController {

    // Create a new Speciality
    async createSpeciality(req, res) {
        try {
            const data = req.body;
            const speciality = await SpecialityServices.createSpeciality(data);
            return res.status(201).json({
                status: 201,
                message: "Speciality created successfully",
                data: speciality
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message || "Unknown error"
            });
        }
    }

    // Get all Specialities
    async getAllSpecialities(req, res) {
        try {
            const specialities = await SpecialityServices.getAllSpecialities();
            return res.status(200).json({
                status: 200,
                message: "All specialities retrieved successfully",
                data: specialities
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error.message || "Unknown error"
            });
        }
    }

    // Get Speciality by ID
    async getSpecialityById(req, res) {
        try {
            const { id } = req.params;
            const speciality = await SpecialityServices.getSpecialityById(id);
            if (!speciality) return res.status(404).json({ status: 404, message: "Speciality not found" });

            return res.status(200).json({
                status: 200,
                message: "Speciality retrieved successfully",
                data: speciality
            });
        } catch (error) {
            return res.status(500).json({ status: 500, message: error.message || "Unknown error" });
        }
    }

    // Update Speciality
    async updateSpeciality(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const updated = await SpecialityServices.updateSpeciality(id, data);

            return res.status(200).json({
                status: 200,
                message: "Speciality updated successfully",
                data: updated
            });
        } catch (error) {
            return res.status(400).json({ status: 400, message: error.message || "Unknown error" });
        }
    }

    // Delete Speciality
    async deleteSpecialityById(req, res) {
        try {
            const { id } = req.params;
            await SpecialityServices.deleteSpecialityById(id);
            return res.status(200).json({ status: 200, message: "Speciality deleted successfully" });
        } catch (error) {
            return res.status(404).json({ status: 404, message: error.message || "Speciality not found" });
        }
    }

    // Get all Specialities for a chef
    async getChefSpecialities(req, res) {
        try {
            const { chefId } = req.params;
            const specialities = await SpecialityServices.getChefSpecialities(chefId);
            return res.status(200).json({
                status: 200,
                message: "Chef specialities retrieved successfully",
                data: specialities
            });
        } catch (error) {
            return res.status(500).json({ status: 500, message: error.message || "Unknown error" });
        }
    }

    // Add subcategories to chef's Speciality
    async addMoreSpecialityToChef(req, res) {
        try {
            const { chefId } = req.params;
            const { subCategories } = req.body;
            const updated = await SpecialityServices.addMoreSpecialityToChef(chefId, subCategories);
            return res.status(200).json({
                status: 200,
                message: "Specialities added successfully",
                data: updated
            });
        } catch (error) {
            return res.status(500).json({ status: 500, message: error.message || "Unknown error" });
        }
    }

    // Delete subcategory from chef's Speciality
    async deleteSubCategory(req, res) {
        try {
            const { chefId, subCategoryId } = req.params;
            const updated = await SpecialityServices.deleteSubCategory(chefId, subCategoryId);
            return res.status(200).json({
                status: 200,
                message: "Subcategory removed successfully",
                data: updated
            });
        } catch (error) {
            return res.status(500).json({ status: 500, message: error.message || "Unknown error" });
        }
    }

    // Assign a Chef Profile to a Speciality
    async assignProfile(req, res) {
        try {
            const specialityId = req.params.specialityId;
            const {chefProfileId} = req.body;
            if (!specialityId || !chefProfileId) {
                return res.status(400).json({ status: 400, message: "specialityId and chefProfileId are required" });
            }
            const updatedSpeciality = await SpecialityServices.assignProfileToSpeciality(specialityId, chefProfileId);
            return res.status(200).json({
                status: 200,
                message: "Chef profile assigned successfully",
                data: updatedSpeciality
            });
        } catch (error) {
            return res.status(500).json({ status: 500, message: error.message || "Unknown error" });
        }
    }

}

export default new SpecialityController();
