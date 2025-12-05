import RoleSchema from "../Models/RoleModel.ts";

class RoleServices {

    async createRole(roleData) {
        try {
            const { name, imageUrl, arabic_description, english_description } = roleData;

            const existRole = await RoleSchema.findOne({ name });
            if (existRole) throw new Error("Role already exists");

            const newRole = await RoleSchema.create({
                name,
                imageUrl,
                arabic_description,
                english_description
            });

            return newRole;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllRoles() {
        try {
            return await RoleSchema.find();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getRoleById(roleId) {
        try {
            const role = await RoleSchema.findById(roleId);
            if (!role) throw new Error("Role not found");

            return role;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteRoleById(roleId) {
        try {
            const deletedRole = await RoleSchema.findByIdAndDelete(roleId);
            if (!deletedRole) throw new Error("Role not found");

            return deletedRole;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getRolesExcept(excludedId) {
        try {
            return await RoleSchema.find({ _id: { $ne: excludedId } });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateRole(roleId, updatedData) {
        try {
            const role = await RoleSchema.findById(roleId);
            if (!role) throw new Error("Role not found");

            if (updatedData.name) role.name = updatedData.name;
            if (updatedData.imageUrl) role.imageUrl = updatedData.imageUrl;
            if (updatedData.arabic_description) role.arabic_description = updatedData.arabic_description;
            if (updatedData.english_description) role.english_description = updatedData.english_description;

            return await role.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateRoleArabicDescription(roleId, { arabic_description }) {
        try {
            const role = await RoleSchema.findById(roleId);
            if (!role) throw new Error("Role not found");

            role.arabic_description = arabic_description;

            return await role.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateRoleEnglishDescription(roleId, { english_description }) {
        try {
            const role = await RoleSchema.findById(roleId);
            if (!role) throw new Error("Role not found");

            role.english_description = english_description;

            return await role.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getEnglishRoles(excludedId) {
        try {
            return await RoleSchema.find({
                english_description: { $exists: true, $ne: "" },
                _id: { $ne: excludedId }
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getArabicRoles(excludedId) {
        try {
            return await RoleSchema.find({
                arabic_description: { $exists: true, $ne: "" },
                _id: { $ne: excludedId }
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default new RoleServices();
