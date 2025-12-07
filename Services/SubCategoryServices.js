import SubCategorySchema from "../Models/SubCategorySchema.js";

class SubCategoryServices {

    // Create Sub Category
    async createSubCategory(data) {
        try {
            const subcategory = await SubCategorySchema.create(data);
            return subcategory;
        } catch (err) {
            throw err;
        }
    }

    // Get All Sub Categories
    async getAllSubCategories() {
        try {
            return await SubCategorySchema.find().lean();
        } catch (err) {
            throw err;
        }
    }

    // Get Sub Category by ID
    async getSubCategoryById(id) {
        try {
            return await SubCategorySchema.findById(id).lean();
        } catch (err) {
            throw err;
        }
    }

    // Delete Sub Category By ID
    async deleteSubCategoryById(id) {
        try {
            return await SubCategorySchema.findByIdAndDelete(id);
        } catch (err) {
            throw err;
        }
    }

    // Update Sub Category
    async updateSubCategory(id, data) {
        try {
            return await SubCategorySchema.findByIdAndUpdate(
                id,
                data,
                { new: true }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    // Get English Subcategories (exclude Arabic fields)
    async getEnglishSubcategories() {
        try {
            return await SubCategorySchema.find(
                {},
                {
                    Arabic_name: 0,
                    Arabic_description: 0,
                }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

    // Get Arabic Subcategories (exclude Arabic fields)
    async getArabicSubcategories() {
        try {
            return await SubCategorySchema.find(
                {},
                {
                    English_name: 0,
                    English_description: 0,
                }
            ).lean();
        } catch (err) {
            throw err;
        }
    }

}

export default new SubCategoryServices();
