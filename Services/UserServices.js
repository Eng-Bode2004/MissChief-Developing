import UserSchema from "../Models/UserSchema.ts";
import bcrypt from "bcrypt";



class UserServices{

    async createUser(userData){

        try {

            const {username,phoneNumber,Password}= userData;

            // Check if User exists
            const existUser = await UserSchema.findOne({
                $or: [
                    {username: username},
                    {phoneNumber: phoneNumber,},
                ],
            });

            if (existUser){
                throw new Error("User is already exists!");
            }

            // Hash Password
            const hashedPassword = bcrypt.hash(Password, 10);

            // Create new User
            const newUser = await UserSchema.create({
                username: username,
                phoneNumber: phoneNumber,
                Password: hashedPassword,
            })

            return newUser;



        } catch (error){

            throw new Error(error.message || "Something went wrong!");
        }
        

    }
















}

export default new UserServices();