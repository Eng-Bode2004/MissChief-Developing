import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    imageUrl:{
        type: String,
    },

    arabic_description: {
        type: String,
    },

    english_description: {
        type: String,
    }

});

export default mongoose.model("Role", RoleSchema);
