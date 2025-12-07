import mongoose from "mongoose";

const SpecialitySchema = new mongoose.Schema(
    {
        Chef_Profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
        },

        Sub_Categories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Sub Category",
                required: true,
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model("Speciality", SpecialitySchema);
