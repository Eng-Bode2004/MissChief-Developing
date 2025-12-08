import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/cloudinary.js";

// Storage configuration
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Miss Chief/Chief/National ID/Back ID",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

// Multer upload middleware
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: (req, file, cb) => {
        const allowed = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Invalid file type, only images allowed!"));
        }
        cb(null, true);
    },
});

export default upload;
