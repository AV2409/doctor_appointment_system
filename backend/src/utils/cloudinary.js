import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    fs.unlinkSync(localFilePath)   // delete temp file after successful upload
    return response
  } catch (error) {
    fs.unlinkSync(localFilePath)   // also delete on failure to avoid temp buildup
    return null
  }
}

export { uploadOnCloudinary }
