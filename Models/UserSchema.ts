import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },

    phoneNumber:{
        type:String,
        required:true,
        unique:true,
    },

    isPhoneVerified:{
        type:Boolean,
        default:false,
    },

    Password:{
        type:String,
        required:true,
    },

    Profile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
    },

    Role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role",
    },

    language:{
        type:String,
        enum:['en','ara'],
        default: 'en',
    }


});

export default mongoose.model('User', UserSchema);
