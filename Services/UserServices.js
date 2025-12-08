import UserSchema from "../Models/UserSchema.ts";
import bcrypt from "bcryptjs";



class UserServices{

    async createUser(userData){

        try {

            const {username,phoneNumber,password}= userData;

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
            const hashedPassword = await bcrypt.hash(password, 10);

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

    async AssignRole(userId,RoleId){
        try {

            // Check if User is its doesn't exist
            const existUser =  await UserSchema.findById(userId);
            if (!existUser) {
                throw new Error('User not found');
            }

            // Assign Role
            const userRole = await UserSchema.findByIdAndUpdate(userId,{
                $set: {Role: RoleId}


            },{ new: true })

            return userRole;

        }catch (error) {
            throw new Error(error.message || 'Error while assigning role');
        }

    }

    async AssignProfile(userId, ProfileId) {
        try {

            // Validate user existence
            const existUser = await UserSchema.findById(userId);
            if (!existUser) {
                throw new Error("User not found");
            }

            // Assign the new profile
            const userProfile = await UserSchema.findByIdAndUpdate(
                userId,
                { $set: { Profile: ProfileId } },
                { new: true }
            );

            return userProfile;
        } catch (error) {
            throw new Error(error.message || "Error while assigning profile");
        }
    }

















}

export default new UserServices();