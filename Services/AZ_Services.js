import AZ_Schema from "../Models/AZ_Schema.js";
import inside from "point-in-polygon";

class AZ_Services {

    // =========================================================
    // CREATE NEW AVAILABILITY ZONE
    // =========================================================
    async createZone(zoneData) {
        try {
            const { name, governorate, city, polygon, delivery_fee_base, delivery_fee_per_km } = zoneData;

            const existZone = await AZ_Schema.findOne({ name });
            if (existZone) {
                throw new Error("Zone already exists");
            }

            if (!Array.isArray(polygon) || polygon.length < 3) {
                throw new Error("Polygon must contain at least 3 points");
            }

            polygon.forEach(p => {
                if (!p.lat || !p.lng) {
                    throw new Error("Polygon points must include lat and lng");
                }
            });

            const zone = await AZ_Schema.create({
                name,
                governorate,
                city,
                polygon,
                delivery_fee_base,
                delivery_fee_per_km,
            });

            return zone;

        } catch (error) {
            throw error;
        }
    }


    // =========================================================
    // GET ALL ZONES
    // =========================================================
    async getAllZones() {
        return await AZ_Schema.find({});
    }


    // =========================================================
    // GET ZONE BY ID
    // =========================================================
    async getZoneById(id) {
        const zone = await AZ_Schema.findById(id);
        if (!zone) throw new Error("Zone not found");
        return zone;
    }


    // =========================================================
    // UPDATE ZONE
    // =========================================================
    async updateZone(id, data) {
        const zone = await AZ_Schema.findByIdAndUpdate(id, data, { new: true });

        if (!zone) throw new Error("Zone not found");
        return zone;
    }


    // =========================================================
    // DELETE ZONE
    // =========================================================
    async deleteZone(id) {
        const zone = await AZ_Schema.findByIdAndDelete(id);
        if (!zone) throw new Error("Zone not found");
        return { message: "Zone deleted successfully" };
    }


    // =========================================================
    // TOGGLE ACTIVE / INACTIVE
    // =========================================================
    async toggleZoneStatus(id) {
        const zone = await AZ_Schema.findById(id);
        if (!zone) throw new Error("Zone not found");

        zone.status = zone.status === "active" ? "inactive" : "active";
        await zone.save();

        return zone;
    }


}

export default new AZ_Services();
