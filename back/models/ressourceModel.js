import connexion from '../config/bdd.js'

// Création d'une ressource (uniquement par piece)
export const createRessource = async (typeTechnique, titre, urlVideo, descriptionTechnique, pieceId, utilisateurId) => {
    const create = `
    INSERT INTO ressources 
    (typeTechnique, titre, urlVideo, descriptionTechnique, pieceId, utilisateurId) 
    VALUES (?, ?, ?, ?, ?, ?);`;
    const [result] = await connexion.query(create, [typeTechnique, titre, urlVideo, descriptionTechnique, pieceId, utilisateurId]);
    return result;
};

// Afficher toutes les ressources
export const getAllRessources = async () => {
    const selectAll = `
    SELECT typeTechnique, titre, urlVideo, descriptionTechnique, pieceId, utilisateurId, pieces.nomPiece, parties.nomPartie, animaux.nomAnimal, utilisateurs.nom AS auteurNom, utilisateurs.prenom AS auteurPrenom
    FROM ressources 
    JOIN pieces ON ressources.pieceId = pieces.idPiece 
    JOIN parties ON pieces.partieId = parties.idPartie 
    JOIN animaux ON parties.animalId = animaux.idAnimal 
    JOIN utilisateurs ON ressources.utilisateurId = utilisateurs.idUtilisateur
    `;
    const [result] = await connexion.query(selectAll);
    return result;
};

// Afficher une ressource par ID
export const getRessourceById = async (id) => {
    const selectById = `
    SELECT typeTechnique, titre, urlVideo, descriptionTechnique, pieceId, utilisateurId, pieces.nomPiece, parties.nomPartie, animaux.nomAnimal, utilisateurs.nom AS auteurNom, utilisateurs.prenom AS auteurPrenom
    FROM ressources 
    JOIN pieces ON ressources.pieceId = pieces.idPiece 
    JOIN parties ON pieces.partieId = parties.idPartie 
    JOIN animaux ON parties.animalId = animaux.idAnimal 
    JOIN utilisateurs ON ressources.utilisateurId = utilisateurs.idUtilisateur
    WHERE ressources.idRessource = ?;
    `;
    const [result] = await connexion.query(selectById, [id]);
    return result[0];
};

// Lire par piece
export const getRessourceByPiece = async (pieceId) => {
    const selectByPiece = `
    SELECT typeTechnique, titre, urlVideo, descriptionTechnique, pieceId, utilisateurId, utilisateurs.nom AS auteurNom, utilisateurs.prenom AS auteurPrenom
    FROM ressources
    JOIN utilisateurs ON ressources.utilisateurId = utilisateurs.idUtilisateur
    WHERE ressources.pieceId = ?;
    `;
    const [result] = await connexion.query(selectByPiece, [pieceId]);
    return result;
};

// Lire par partie
export const getRessourceByPartie = async (partieId) => {
    const selectByPartie = `
    SELECT typeTechnique, titre, urlVideo, descriptionTechnique, pieceId, utilisateurId, utilisateurs.nom AS auteurNom, utilisateurs.prenom AS auteurPrenom
    FROM ressources
    JOIN pieces ON ressources.pieceId = pieces.idPiece
    JOIN utilisateurs ON ressources.utilisateurId = utilisateurs.idUtilisateur
    WHERE pieces.partieId = ?;
    `;
    const [result] = await connexion.query(selectByPartie, [partieId]);
    return result;
};

// Lire par animal
export const getRessourceByAnimal = async (animalId) => {
    const selectByAnimal = `
    SELECT typeTechnique, titre, urlVideo, descriptionTechnique, pieceId, utilisateurId, pieces.nomPiece, parties.nomPartie
    FROM ressources
    JOIN pieces ON ressources.pieceId = pieces.idPiece
    JOIN parties ON pieces.partieId = parties.idPartie
    WHERE parties.animalId = ?;
    `;
    const [result] = await connexion.query(selectByAnimal, [animalId]);
    return result;
};

export const updateRessource = async (idRessource, typeTechnique, titre, urlVideo, descriptionTechnique, pieceId) => {
    const update = `
    UPDATE ressources
    SET typeTechnique = ?, titre = ?, urlVideo = ?, descriptionTechnique = ?, pieceId = ?
    WHERE idRessource = ?;
    `;
    const [result] = await connexion.query(update, [typeTechnique, titre, urlVideo, descriptionTechnique, pieceId, idRessource]);
    return result;
};

export const deleteRessource = async (idRessource) => {
    const del = `
    DELETE FROM ressources
    WHERE idRessource = ?;
    `;
    const [result] = await connexion.query(del, [idRessource]);
    return result;
};