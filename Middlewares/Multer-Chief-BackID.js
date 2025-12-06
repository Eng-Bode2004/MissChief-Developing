const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../Config/Cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Miss Chief/Chief/National ID/Back ID",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

module.exports = multer({ storage });
