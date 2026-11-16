import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

const DOSSIER = 'atelier-du-boucher/actualites';

export const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: DOSSIER }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result.secure_url);
        });
        stream.end(buffer);
    });
};

export const extrairePublicId = (url) => {
    const apresUpload = url.split('/upload/')[1];
    const sansVersion = apresUpload.replace(/^v\d+\//, '');
    return sansVersion.substring(0, sansVersion.lastIndexOf('.'));
};

export const supprimerImage = async (url) => {
    if (!url) {
        return;
    }

    try {
        if (url.includes('res.cloudinary.com')) {
            await cloudinary.uploader.destroy(extrairePublicId(url));
        } else if (url.includes('/uploads/')) {
            const nomFichier = url.split('/uploads/')[1];
            await fs.promises.unlink(`uploads/${nomFichier}`);
        }
    } catch (error) {
        console.error("Erreur suppression image : ", error);
    }
};
