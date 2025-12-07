import Speciality from "../Models/SpecialitySchema.js";

class SpecialityServices {

    // Create Speciality
    async createSpeciality(data: any) {
        const speciality = await Speciality.create(data);
        return speciality;
    }

    // Get All Specialities
    async getAllSpecialities() {
        return Speciality.find()
            .populate("Chef_Profile")
            .populate("Sub_Categories")
            .lean();
    }

    // Get Speciality By ID
    async getSpecialityById(id: string) {
        return Speciality.findById(id)
            .populate("Chef_Profile")
            .populate("Sub_Categories")
            .lean();
    }

    // Delete Speciality By ID
    async deleteSpecialityById(id: string) {
        return Speciality.findByIdAndDelete(id);
    }

    // Update Speciality
    async updateSpeciality(id: string, data: any) {
        return Speciality.findByIdAndUpdate(id, data, {
            new: true,
        })
            .populate("Chef_Profile")
            .populate("Sub_Categories")
            .lean();
    }

    async getChefSpecialities(chefId: string) {
        return Speciality.find({ Chef_Profile: chefId });
    }

    async addMoreSpecialityToChef(chefId: string, subCategories: string[]) {
        return Speciality.findOneAndUpdate(
            { Chef_Profile: chefId },
            {
                $addToSet: {
                    Sub_Categories: { $each: subCategories }
                }
            },
            { new: true }
        )
    }

    async deleteSubCategory(chefId: string, subCategoryId: string) {
        return Speciality.findOneAndUpdate(
            { Chef_Profile: chefId },
            {
                $pull: {
                    Sub_Categories: subCategoryId
                }
            },
            { new: true }
        )
    }



}

export default new SpecialityServices();
