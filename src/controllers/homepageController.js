//import { findArtwork, getArtwork, uploadArtwork } from '../Utils/Gridfs.js';
import { findArtwork, retrieveImage, uploadArtwork } from '../Utils/Bson.js'; // Import the uploadArtwork function

export async function updateHomepage() {
   try {
        var fileId = new Array(3);
        fileId = await findArtwork(3);
        for (let i = 1; i <= 3; i++) {
            console.log(`Retrieving image with ID: ${fileId[i-1]._id}`);
            var fileDestination =`./cozastore-master-template/images/slide-0${i}.jpg`;
            await retrieveImage(fileId[i-1]._id, fileDestination);
        }
        
    } catch (error) {
        throw error;
    }
}