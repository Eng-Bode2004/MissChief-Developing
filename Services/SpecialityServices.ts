import Speciality from "../Models/SpecialitySchema.ts";

class SpecialityServices {

    // Create a new Speciality
    async createSpeciality(data: any) {
        const speciality = await Speciality.create(data);
        return speciality;
    }

    // Get all Specialities
    async getAllSpecialities() {
        return Speciality.find();
    }

    // Get Speciality by ID
    async getSpecialityById(id: string) {
        return Speciality.findById(id);
    }

    // Update Speciality
    async updateSpeciality(id: string, data: any) {
        const updated = await Speciality.findByIdAndUpdate(id, data, { new: true });

        if (!updated) throw new Error("Speciality not found");
        return updated;
    }

    // Delete Speciality
    async deleteSpecialityById(id: string) {
        const deleted = await Speciality.findByIdAndDelete(id);
        if (!deleted) throw new Error("Speciality not found");
        return deleted;
    }

    // Get all Specialities for a specific chef
    async getChefSpecialities(chefId: string) {
        return Speciality.find({ Chef_Profile: chefId });
    }

    // Add more subcategories to chef's Speciality
    async addMoreSpecialityToChef(chefId: string, subCategories: string[]) {
        const updated = await Speciality.findOneAndUpdate(
            { Chef_Profile: chefId },
            { $addToSet: { Sub_Categories: { $each: subCategories } } },
            { new: true }
        );

        if (!updated) throw new Error("Speciality not found");
        return updated;
    }

    // Delete a subcategory from chef's Speciality
    async deleteSubCategory(chefId: string, subCategoryId: string) {
        const updated = await Speciality.findOneAndUpdate(
            { Chef_Profile: chefId },
            { $pull: { Sub_Categories: subCategoryId } },
            { new: true }
        );

        if (!updated) throw new Error("Speciality not found");
        return updated;
    }

    // Assign a Chef Profile to a Speciality
    async assignProfileToSpeciality(specialityId: string, chefProfileId: string) {
        const updated = await Speciality.findByIdAndUpdate(
            specialityId,
            { Chef_Profile: chefProfileId },
            { new: true }
        );

        if (!updated) throw new Error("Speciality not found");
        return updated;
    }

}

export default new SpecialityServices();
