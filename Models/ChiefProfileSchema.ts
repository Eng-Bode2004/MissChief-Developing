import mongoose from "mongoose";

const ChiefProfileSchema = new mongoose.Schema({

    National_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "National ID"
    },

    name: {
        type: String,
    },

    Max_orders_per_Day: {
        type: Number,
    },

    Is_Verified: {
        type: Boolean,
        default: false,
    }

});

export default mongoose.model("Chief Profile", ChiefProfileSchema);
