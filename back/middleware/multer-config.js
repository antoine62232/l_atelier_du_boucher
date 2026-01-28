import multer from 'multer';

// Dictionnaire des types de fichiers acceptés
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

const storage = multer.diskStorage({
    // Spécification du dossier de destination
    destination: (req, file, callback) => {
        // Dossier de destination : uploads
        callback(null, 'uploads');
    },
    // Spécification du nom du fichier
    filename: (req, file, callback) => {
        // On remplace les espaces par des underscores pour éviter les bugs
        const name = file.originalname.split(' ').join('_').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];

        // On ajoute un timestamp pour éviter les doublons : nom + timestamp + extension
        callback(null, name + '_' + Date.now() + '.' + extension);
    }
});

export default multer({ storage: storage }).single('image');