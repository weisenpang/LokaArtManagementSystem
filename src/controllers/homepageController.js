import { findArtwork, getArtwork, uploadArtwork } from '../Utils/Gridfs.js';

export async function updateHomepage() {
   try {
        for (let i = 1; i <= 3; i++) {
            var fileDestination =`./cozastore-master-template/images/slide-0${i}.jpg`;
            const fileId = '689af18b7c24ed9c4cb9de58';
            const artwork = await getArtwork(fileId, fileDestination);
        }
    } catch (error) {
        console.error("Error updating homepage:", error);
    }
}