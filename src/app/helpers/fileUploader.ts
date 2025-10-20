import multer from "multer"
import path from "path"
import { envVars } from "../config/env"
import { v2 as Cloudinary } from "cloudinary"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

const uploadToCloudinary = async (file: Express.Multer.File) => {
    // Configuration
    Cloudinary.config({
        cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
        api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
        api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
    });

    // Upload an image
    const uploadResult = await Cloudinary.uploader
        .upload(
            file.path, {
            public_id: file.filename,
        }
        )
        .catch((error) => {
            console.log(error);
        });
    return uploadResult;

}

export const fileUploader = {
    upload,
    uploadToCloudinary
}