import multer from 'multer';

// Types de fichiers acceptés
const MIME_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

// L'image reste en mémoire : elle est envoyée ensuite sur Cloudinary,
// car le disque de Render est effacé à chaque redéploiement
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (MIME_TYPES.includes(file.mimetype)) {
            callback(null, true);
        } else {
            const erreur = new Error("Format d'image non accepté");
            erreur.status = 400;
            callback(erreur);
        }
    }
}).single('image');

// Une erreur multer (fichier trop lourd, mauvais format) renvoie un 400 au lieu d'un 500
export default (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? "Image trop lourde (5 Mo maximum)" : err.message });
        }
        next();
    });
};
