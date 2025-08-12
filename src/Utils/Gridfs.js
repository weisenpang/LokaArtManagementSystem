import { GridFSBucket, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'test'; // Replace with your database name
const db = client.db(dbName);
const bucket = new GridFSBucket(db, { bucketName: 'Artwork' });
export const uploadArtwork = async () => {
    try {

        const fileStream = fs.createReadStream('./src/Utils/LPW6.png'); // Path to the file you want to upload

        // 3. Open an upload stream
        const uploadStream = bucket.openUploadStream('LPW6.png');

        // 4. Pipe the file into GridFS
        fileStream.pipe(uploadStream);

        uploadStream.on('finish', () => {
            console.log('File uploaded successfully! 💖');
            console.log('File ID:', uploadStream.id);
        });

        // Handle errors during upload
        uploadStream.on('error', (error) => {
            console.error('Upload error:', error);
        });
        
    } catch (error){
        console.log("failed to connect: " + error);
    }

}

export const getArtwork = async (fileId, fileDestination) => {
    return new Promise((resolve, reject) => {
        // 1. Convert fileId to ObjectId if it's a string
        const objectId = new ObjectId(fileId);

        // 2. Open a download stream
        const downloadStream = bucket.openDownloadStream(objectId);

        // 3. Pipe the download stream to a writable stream (e.g., a file)
        const writeStream = fs.createWriteStream(fileDestination);

        downloadStream.pipe(writeStream);

        writeStream.on('finish', () => {
            console.log('File downloaded successfully!');
            resolve();  // Resolve on success
        });

        downloadStream.on('error', (error) => {
            console.error('Download error:', error);
            reject(error);  // Reject on error
        });
    });
}

export const findArtwork = async (limit) => {
    try {
        const db = client.db(dbName);
        const bucket = new GridFSBucket(db, { bucketName: 'Artwork' });

        // 1. Get all files in the bucket
        const files = await bucket.find({}).limit(limit).toArray();

        if (files.length === 0) {
            console.log('No files found in the bucket.');
            return;
        }

        console.log('Files in the bucket:');
        files.forEach(file => {
            console.log(`- ${file._id} (${file.length} bytes)`);
        });

    } catch (error) {
        console.error("Failed to get all artwork:", error);
    }
}