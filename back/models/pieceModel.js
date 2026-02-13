import connexion from '../config/bdd.js';

export const createPiece = async (nomPiece, descriptionPiece, utilisation, cuisson, imagePiece, partieId) => {
    const query = `
        INSERT INTO pieces 
        (nomPiece, descriptionPiece, utilisation, cuisson, imagePiece, partieId) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connexion.query(query, [nomPiece, descriptionPiece, utilisation, cuisson, imagePiece, partieId]);
    return result;
};

// Afficher toutes les pieces avec le nom de la partie et de l'animal
export const getAllPieces = async () => {
    const query = `
    SELECT pieces.idPiece, 
    pieces.nomPiece, 
    pieces.descriptionPiece, 
    pieces.utilisation, 
    pieces.cuisson, 
    pieces.imagePiece, 
    pieces.partieId, 
    parties.nomPartie, 
    animaux.nomAnimal
    FROM pieces
    JOIN parties ON pieces.partieId = parties.idPartie
    JOIN animaux ON parties.animalId = animaux.idAnimal
    ORDER BY pieces.nomPiece ASC;
    `
    const [result] = await connexion.query(query);
    return result;
};

// Afficher une piece par son id
export const getPieceById = async (idPiece) => {
    const query = `
    SELECT pieces.idPiece, 
    pieces.nomPiece, 
    pieces.descriptionPiece, 
    pieces.utilisation, 
    pieces.cuisson, 
    pieces.imagePiece, 
    pieces.partieId, 
    parties.nomPartie, 
    animaux.nomAnimal
    FROM pieces
    JOIN parties ON pieces.partieId = parties.idPartie
    JOIN animaux ON parties.animalId = animaux.idAnimal
    WHERE pieces.idPiece = ?
    `
    const [result] = await connexion.query(query, [idPiece]);
    return result[0];
};

// Afficher les pièces d'une partie spécifique
export const getPiecesByPartie = async (partieId) => {
    const query = `
        SELECT idPiece, nomPiece, descriptionPiece, utilisation, cuisson, imagePiece, partieId
        FROM pieces WHERE partieId = ? ORDER BY nomPiece ASC;
    `;
    const [result] = await connexion.query(query, [partieId]);
    return result;
};

export const updatePiece = async (idPiece, nomPiece, descriptionPiece, utilisation, cuisson, imagePiece, partieId) => {
    const query = `
        UPDATE pieces
        SET nomPiece = ?, descriptionPiece = ?, utilisation = ?, cuisson = ?, imagePiece = ?, partieId = ?
        WHERE idPiece = ?
    `;
    const [result] = await connexion.query(query, [nomPiece, descriptionPiece, utilisation, cuisson, imagePiece, partieId, idPiece]);
    return result;
};

export const deletePiece = async (idPiece) => {
    const query = `
        DELETE FROM pieces
        WHERE idPiece = ?
    `;
    const [result] = await connexion.query(query, [idPiece]);
    return result;
};