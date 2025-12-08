import ImageServices from "../Services/ImageServices.js";

class ImagesControllers{
    async uploadPhoto(req, res){
        try {
            if(!req.file){
                return res.status(400).send({
                    message: 'No file uploaded',
                    status: "failure",
                })
            }

            const imageData = {
                URL: req.file.path || req.file.secure_url, // Cloudinary provides both
                title: req.body.title || req.file.originalname,
                description: req.body.description || ''
            };

            const savedImage = await ImageServices.uploadPhoto(imageData);
            return res.status(201).send({
                message: "Image uploaded successfully",
                status: "success",
                data: savedImage
            });


        }
        catch (error){
            res.status(400).send({
                error: error.message,
                status: "Failed to upload Photo",
            });
        }
    }
}

export default new ImagesControllers();