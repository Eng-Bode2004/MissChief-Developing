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
                throw new Error("اسم المستخدم او رقم الهاتف موجود بالفعل!");
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

            throw new Error(error.message || "لقد حدث خطأ ما!");
        }
        

    }

    async AssignRole(userId,RoleId){
        try {

            // Check if User is its doesn't exist
            const existUser =  await UserSchema.findById(userId);
            if (!existUser) {
                throw new Error('لم يتم العثور على المستخدم');
            }

            // Assign Role
            const userRole = await UserSchema.findByIdAndUpdate(userId,{
                $set: {Role: RoleId}


            },{ new: true })

            return userRole;

        }catch (error) {
            throw new Error(error.message || 'حدث خطأ أثناء تعيين الدور');
        }

    }

    async AssignProfile(userId, ProfileId) {
        try {

            // Validate user existence
            const existUser = await UserSchema.findById(userId);
            if (!existUser) {
                throw new Error("لم يتم العثور على المستخدم");
            }

            // Assign the new profile
            const userProfile = await UserSchema.findByIdAndUpdate(
                userId,
                { $set: { Profile: ProfileId } },
                { new: true }
            );

            return userProfile;
        } catch (error) {
            throw new Error(error.message || "حدث خطأ أثناء تعيين الملف الشخصي");
        }
    }

















}

export default new UserServices();