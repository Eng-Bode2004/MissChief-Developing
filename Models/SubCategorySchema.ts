import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema({


    Arabic_name:{
        type: String,
        required: true,
        unique: true
    },

    English_name:{
        type: String,
        required: true,
        unique: true
    },


    English_description:{
        type: String,
    },


    Arabic_description:{
        type: String,
    },


    image_url:{
        type: String,
    }

    

})

export default mongoose.model("Sub Category", SubCategorySchema);