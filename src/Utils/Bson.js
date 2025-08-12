import { MongoClient } from 'mongodb';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();


const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'test'; // Replace with your database name
const db = client.db(dbName);
const collection = db.collection('images');

export async function uploadArtwork() {
    try {
        await client.connect();
        
        
        const imageData = fs.readFileSync('./src/Utils/LPW4.png');
        
        // Perform all your DB operations before closing
        await collection.insertOne({
            name: 'LPW4.png',
            image: imageData,
            uploadDate: new Date()
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

export async function retrieveImage(fileId, fileDestination) {
  try {
    await client.connect();
    // Find the image document (e.g., by name or ID)
    const imageDoc = await collection.findOne({ _id: fileId });
    
    if (!imageDoc) {
      console.log("Image not found, pookie! 😢");
      return;
    }
    
    // Save the binary data back to a file
    fs.writeFileSync(fileDestination, imageDoc.image.buffer);
    console.log("Image retrieved successfully! 💖");
    
  } catch (error) {
    console.error("Error retrieving image:", error);
  } finally {
    await client.close();
  }
}

export async function findArtwork(limit) {
  try {
    await client.connect();
    const artworks = await collection.find({}).limit(limit).toArray();
    console.log("Found artworks:", artworks);
    return artworks;
  } catch (error) {
    console.error("Error finding artwork:", error);
  } finally {
    await client.close();
  }
}