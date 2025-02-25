import { v2 as cloudinary } from 'cloudinary';
import config from '../config/config.js';
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.API_KEY,
    api_secret: config.API_SECRET
});

export const uploadFile = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "insta" }, (err, fileData) => {
                if (err) reject(err)
                else resolve({
                    url: fileData.url,
                    public_id: fileData.public_id,
                    asset_id: fileData.asset_id,
                    format: fileData.format,
                })
            })
        Readable.from(fileBuffer).pipe(uploadStream)
    })
}