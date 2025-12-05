import AZ_Schema from "../Models/AZ_Schema.js";
import inside from "point-in-polygon";
import { getDistance } from "geolib";
import "dotenv/config";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ;
const GEMINI_API_URL = process.env.GEMINI_API_URL;

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

    // =========================================================
    // CHECK IF A POINT IS INSIDE ANY ZONE
    // =========================================================

    async checkLocation(point) {
        const { lat, lng } = point;
        const zones = await AZ_Schema.find({ status: "active" });

        // 1️⃣ تحقق إذا داخل أي منطقة
        let matchedZone = null;
        for (const zone of zones) {
            const polygonPoints = zone.polygon.map(p => [p.lat, p.lng]);
            if (inside([lat, lng], polygonPoints)) {
                matchedZone = zone;
                break;
            }
        }

        if (matchedZone) {
            return {
                insideZone: true,
                zone: matchedZone
            };
        }

        // 2️⃣ لو مش داخل أي منطقة، حساب أقرب منطقة
        let closestZone = null;
        let minDistance = Infinity;

        zones.forEach(zone => {
            const avgLat = zone.polygon.reduce((sum, p) => sum + p.lat, 0) / zone.polygon.length;
            const avgLng = zone.polygon.reduce((sum, p) => sum + p.lng, 0) / zone.polygon.length;

            const distance = getDistance(
                { latitude: lat, longitude: lng },
                { latitude: avgLat, longitude: avgLng }
            );

            if (distance < minDistance) {
                minDistance = distance;
                closestZone = zone;
            }
        });

        // 3️⃣ إرسال request لـ Gemini AI
        let aiSuggestion = { message: "AI not available" };
        try {
            if (GEMINI_API_KEY) {
                const prompt = `Suggest the best availability zone for latitude: ${lat}, longitude: ${lng}. Zones: ${zones.map(z => z.name).join(", ")}`;
                const response = await fetch("https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=" + GEMINI_API_KEY, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt })
                });
                const data = await response.json();
                aiSuggestion.message = data.candidates?.[0]?.content || "No AI suggestion available";
            }
        } catch (err) {
            aiSuggestion.message = "AI error: " + (err.message || "Unknown");
        }

        return {
            insideZone: false,
            suggestedZone: closestZone ? closestZone.name : null,
            distanceToSuggestedZone_m: minDistance,
            aiSuggestion
        };
    }

    // AI SUGGESTION USING GOOGLE GEMINI
    async getAISuggestion(lat, lng, closestZone) {
        try {
            const prompt = `
            User location: lat=${lat}, lng=${lng}
            Closest available zone: ${closestZone ? closestZone.name : "None"}
            Suggest the best available zone for delivery and provide latitude and longitude. 
            Format response as JSON with keys: suggestedZone, suggestedLat, suggestedLng, reason.
            `;

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    temperature: 0.2,
                    max_output_tokens: 300
                })
            });

            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const aiText = data.candidates[0].content;
                try {
                    return JSON.parse(aiText);
                } catch (e) {
                    return { message: aiText }; // fallback
                }
            }
            return { message: "No suggestion from AI" };
        } catch (error) {
            console.error("AI suggestion error:", error.message);
            return { message: "AI error" };
        }
    }

}

export default new AZ_Services();
