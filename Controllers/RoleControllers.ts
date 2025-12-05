import type { Request, Response } from "express";
import RoleServices from "../Services/RoleServices.js";

class RoleControllers {

    async createRole(req: Request, res: Response): Promise<Response> {
        try {
            const roleData = req.body;
            const newRole = await RoleServices.createRole(roleData);

            return res.status(201).json({
                status: 201,
                message: "Role created successfully",
                data: newRole,
            });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async getAllRoles(req: Request, res: Response): Promise<Response> {
        try {
            const roles = await RoleServices.getAllRoles();

            return res.status(200).json({
                status: 200,
                message: "Roles retrieved successfully",
                data: roles,
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    async getRoleById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const role = await RoleServices.getRoleById(id);

            return res.status(200).json({
                status: 200,
                message: "Role found",
                data: role,
            });
        } catch (error) {
            return res.status(404).json({
                status: 404,
                message: error instanceof Error ? error.message : "Role not found",
            });
        }
    }

    async deleteRoleById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await RoleServices.deleteRoleById(id);

            return res.status(200).json({
                status: 200,
                message: "Role deleted successfully",
            });
        } catch (error) {
            return res.status(404).json({
                status: 404,
                message: error instanceof Error ? error.message : "Role not found",
            });
        }
    }

    async updateRole(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const updatedRole = await RoleServices.updateRole(id, updatedData);

            return res.status(200).json({
                status: 200,
                message: "Role updated successfully",
                data: updatedRole,
            });
        } catch (error) {
            return res.status(404).json({
                status: 404,
                message: error instanceof Error ? error.message : "Role not found",
            });
        }
    }

    async updateRoleArabicDescription(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { arabic_description } = req.body;

            const role = await RoleServices.updateRoleArabicDescription(id, { arabic_description });

            return res.status(200).json({
                status: 200,
                message: "Arabic description updated successfully",
                data: role,
            });
        } catch (error) {
            return res.status(404).json({
                status: 404,
                message: error instanceof Error ? error.message : "Role not found",
            });
        }
    }

    async updateRoleEnglishDescription(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { english_description } = req.body;

            const role = await RoleServices.updateRoleEnglishDescription(id, { english_description });

            return res.status(200).json({
                status: 200,
                message: "English description updated successfully",
                data: role,
            });
        } catch (error) {
            return res.status(404).json({
                status: 404,
                message: error instanceof Error ? error.message : "Role not found",
            });
        }
    }
}

export default new RoleControllers();
