CREATE DATABASE atelier_boucher;

USE atelier_boucher;

CREATE TABLE races (
idRace INT AUTO_INCREMENT PRIMARY KEY,
nomRace VARCHAR(100) NOT NULL,
classification VARCHAR(50) NOT NULL,
animalId INT NOT NULL
);

CREATE TABLE animaux (
idAnimal INT AUTO_INCREMENT PRIMARY KEY,
nomAnimal VARCHAR(100) NOT NULL
);
 
CREATE TABLE parties (
idPartie INT AUTO_INCREMENT PRIMARY KEY,
nomPartie VARCHAR(255) NOT NULL,
descriptionPartie TEXT NOT NULL,
imagePartie VARCHAR(255) NOT NULL,
animalId INT NOT NULL
);

CREATE TABLE termes (
idTerme INT AUTO_INCREMENT PRIMARY KEY,
nomTerme VARCHAR(255) NOT NULL,
definition TEXT NOT NULL,
exemple TEXT
);

CREATE TABLE ressourcesTermes (
PRIMARY KEY (ressourceId, termeId),
ressourceId INT NOT NULL,
termeId INT NOT NULL
);

CREATE TABLE ressources (
idRessource INT AUTO_INCREMENT PRIMARY KEY,
typeTechnique VARCHAR(100),
titre VARCHAR(255),
urlVideo TEXT,
descriptionTechnique TEXT,
pieceId INT NOT NULL,
utilisateurId INT NOT NULL
);

CREATE TABLE utilisateurs (
idUtilisateur INT AUTO_INCREMENT PRIMARY KEY,
nom VARCHAR(100) NOT NULL,
prenom VARCHAR(100) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
motDePasse VARCHAR(255) NOT NULL,
dateInscription DATETIME DEFAULT CURRENT_TIMESTAMP,
roleId INT NOT NULL
);

CREATE TABLE roles (
idRole INT AUTO_INCREMENT PRIMARY KEY,
nomRole VARCHAR(100) NOT NULL,
descriptionRole VARCHAR(255) NOT NULL
);                           

CREATE TABLE avis (
idAvis INT AUTO_INCREMENT PRIMARY KEY,
note INT,
commentaire TEXT,
dateAvis DATETIME DEFAULT CURRENT_TIMESTAMP,
utilisateurId INT NOT NULL,
ressourceId INT
);  

CREATE TABLE tags (
idTag INT AUTO_INCREMENT PRIMARY KEY,
nomTag VARCHAR(100) NOT NULL
);

CREATE TABLE piecesTags (
PRIMARY KEY (pieceId, tagId),
pieceId INT NOT NULL,
tagId INT NOT NULL
);  

CREATE TABLE ingredients (
idIngredient INT AUTO_INCREMENT PRIMARY KEY,
nomIngredient VARCHAR(255) NOT NULL
);

CREATE TABLE pieces (
idPiece INT AUTO_INCREMENT PRIMARY KEY,
nomPiece VARCHAR(255) NOT NULL,
descriptionPiece TEXT,
utilisation VARCHAR(255),
cuisson VARCHAR(255),
imagePiece VARCHAR(255),
partieId INT NOT NULL
);

CREATE TABLE recettes (
idRecette INT AUTO_INCREMENT PRIMARY KEY,
titre VARCHAR(255) NOT NULL,
tempsPreparation INT NOT NULL,
tempsCuisson INT NOT NULL,
difficulte INT NOT NULL,
cout INT NOT NULL,
nbPersonnes INT NOT NULL,
pieceId INT NOT NULL
);

CREATE TABLE questions (
idQuestion INT AUTO_INCREMENT PRIMARY KEY,
texteQuestion TEXT NOT NULL,
typeQuestion VARCHAR(50) NOT NULL,
explication TEXT,
pieceId INT NULL
);

CREATE TABLE reponsesQcm (
idReponse INT AUTO_INCREMENT PRIMARY KEY,
texteReponse VARCHAR(255) NOT NULL,
resultatReponse BOOLEAN NOT NULL,
questionId INT NOT NULL
);

CREATE TABLE instructions (
idInstruction INT AUTO_INCREMENT PRIMARY KEY,
ordreEtape INT NOT NULL,
descriptionEtape TEXT NOT NULL,
recetteId INT NOT NULL
);

CREATE TABLE recettesIngredients (
PRIMARY KEY (recetteId, ingredientId),
quantiteValeur FLOAT NOT NULL,
unite VARCHAR(50),
recetteId INT NOT NULL,
ingredientId INT NOT NULL
);

CREATE TABLE calculsRendement (
    idCalcul INT AUTO_INCREMENT PRIMARY KEY,
    titreCalcul VARCHAR(150) NOT NULL,
    dateCalcul DATETIME DEFAULT CURRENT_TIMESTAMP,
    poidsBrut DECIMAL(10,3) NOT NULL,
    prixAchatKg DECIMAL(10,2) NOT NULL,
    poidsNet DECIMAL(10,3) NOT NULL,
    poidsPerte DECIMAL(10,3) NOT NULL,
    resultatRendement DECIMAL(5,2) NOT NULL,
    margeVisee DECIMAL(5,2) NOT NULL,
    tauxTVA DECIMAL(4,2) NOT NULL DEFAULT 5.50,
    prixRevientKg DECIMAL(10,2) NOT NULL,
    prixVenteConseilleKg DECIMAL(10,2) NOT NULL,
    commentaire TEXT,
    utilisateurId INT NOT NULL,
    pieceId INT NOT NULL,
    
    CONSTRAINT fk_calcul_user FOREIGN KEY (utilisateurId) REFERENCES utilisateurs(idUtilisateur) ON DELETE CASCADE,
    CONSTRAINT fk_calcul_piece FOREIGN KEY (pieceId) REFERENCES pieces(idPiece) ON DELETE CASCADE
);

ALTER TABLE ressourcesTermes
ADD CONSTRAINT fkRessourcesTermesRessources FOREIGN KEY (ressourceId) REFERENCES ressources(idRessource) ON DELETE CASCADE,
ADD CONSTRAINT fkRessourcesTermesTermes FOREIGN KEY (termeId) REFERENCES termes(idTerme) ON DELETE CASCADE;

ALTER TABLE ressources
ADD CONSTRAINT fkRessourcesPieces FOREIGN KEY (pieceId) REFERENCES pieces(idPiece) ON DELETE CASCADE,
ADD CONSTRAINT fkRessourcesUtilisateurs FOREIGN KEY (utilisateurId) REFERENCES utilisateurs(idUtilisateur);

ALTER TABLE piecesTags
ADD CONSTRAINT fkPiecesTagsPieces FOREIGN KEY (pieceId) REFERENCES pieces(idPiece) ON DELETE CASCADE,
ADD CONSTRAINT fkPiecesTagsTags FOREIGN KEY (tagId) REFERENCES tags(idTag) ON DELETE CASCADE;

ALTER TABLE utilisateurs
ADD CONSTRAINT fkUtilisateursRoles FOREIGN KEY (roleId) REFERENCES roles(idRole);

ALTER TABLE avis
ADD CONSTRAINT fkAvisUtilisateurs FOREIGN KEY (utilisateurId) REFERENCES utilisateurs(idUtilisateur) ON DELETE CASCADE,
ADD CONSTRAINT fkAvisRessources FOREIGN KEY (ressourceId) REFERENCES ressources(idRessource) ON DELETE CASCADE;

ALTER TABLE pieces
ADD CONSTRAINT fkPiecesParties FOREIGN KEY (partieId) REFERENCES parties(idPartie) ON DELETE CASCADE;

ALTER TABLE parties
ADD CONSTRAINT fkPartiesAnimaux FOREIGN KEY (animalId) REFERENCES animaux(idAnimal) ON DELETE CASCADE;

ALTER TABLE races
ADD CONSTRAINT fkRacesAnimaux FOREIGN KEY (animalId) REFERENCES animaux(idAnimal) ON DELETE CASCADE;

ALTER TABLE questions
ADD CONSTRAINT fkQuestionsPieces FOREIGN KEY (pieceId) REFERENCES pieces(idPiece) ON DELETE SET NULL;

ALTER TABLE reponsesQcm
ADD CONSTRAINT fkReponsesQcmQuestions FOREIGN KEY (questionId) REFERENCES questions(idQuestion) ON DELETE CASCADE;

ALTER TABLE instructions
ADD CONSTRAINT fkInstructionsRecettes FOREIGN KEY (recetteId) REFERENCES recettes(idRecette) ON DELETE CASCADE;

ALTER TABLE recettesIngredients
ADD CONSTRAINT fkRecettesRecettesIngredients FOREIGN KEY (recetteId) REFERENCES recettes(idRecette) ON DELETE CASCADE,
ADD CONSTRAINT fkRecettesIngredientsIngredients FOREIGN KEY (ingredientId) REFERENCES ingredients(idIngredient) ON DELETE CASCADE;

ALTER TABLE recettes
ADD CONSTRAINT fkRecettesPieces FOREIGN KEY (pieceId) REFERENCES pieces(idPiece) ON DELETE CASCADE;

ALTER TABLE questions
ADD COLUMN partieId INT NULL,
ADD COLUMN animalId INT NULL,
ADD COLUMN raceId INT NULL,
ADD CONSTRAINT fk_questions_parties FOREIGN KEY (partieId) REFERENCES parties(idPartie) ON DELETE CASCADE,
ADD CONSTRAINT fk_questions_animaux FOREIGN KEY (animalId) REFERENCES animaux(idAnimal) ON DELETE CASCADE,
ADD CONSTRAINT fk_questions_races FOREIGN KEY (raceId) REFERENCES races(idRace) ON DELETE CASCADE;

ALTER TABLE calculsRendement 
ADD COLUMN tauxTVA DECIMAL(4,2) NOT NULL DEFAULT 5.50 AFTER margeVisee;                           

CREATE TABLE actualites (
    idActualite INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    contenu TEXT NOT NULL,
    imageActualite VARCHAR(255),
    categorie VARCHAR(50) NOT NULL,
    lienSource VARCHAR(255),
    datePublication DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    utilisateurId INT NOT NULL,
    CONSTRAINT fk_actualites_users FOREIGN KEY (utilisateurId) REFERENCES utilisateurs(idUtilisateur) ON DELETE CASCADE
);

CREATE TABLE contacts (
    idContact INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150) NOT NULL,
    objet VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    dateEnvoi DATETIME DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(50) DEFAULT 'Non lu',
    utilisateurId INT NULL,
    CONSTRAINT fk_contact_user FOREIGN KEY (utilisateurId) REFERENCES utilisateurs(idUtilisateur) ON DELETE SET NULL
);

CREATE TABLE faq (
    idFaq INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    reponse TEXT NOT NULL,
    ordre INT DEFAULT 0
);

ALTER TABLE recettes 
ADD COLUMN imageRecette VARCHAR(255) NULL AFTER titre;

-- Table pour les recettes favorites
CREATE TABLE favorisRecettes (
    utilisateurId INT NOT NULL,
    recetteId INT NOT NULL,
    dateAjout DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (utilisateurId, recetteId),
    CONSTRAINT fk_fav_recettes_user FOREIGN KEY (utilisateurId) REFERENCES utilisateurs(idUtilisateur) ON DELETE CASCADE,
    CONSTRAINT fk_fav_recettes_recette FOREIGN KEY (recetteId) REFERENCES recettes(idRecette) ON DELETE CASCADE
);

-- Table pour les vidéos/ressources favorites
CREATE TABLE favorisRessources (
    utilisateurId INT NOT NULL,
    ressourceId INT NOT NULL,
    dateAjout DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (utilisateurId, ressourceId),
    CONSTRAINT fk_fav_ressources_user FOREIGN KEY (utilisateurId) REFERENCES utilisateurs(idUtilisateur) ON DELETE CASCADE,
    CONSTRAINT fk_fav_ressources_video FOREIGN KEY (ressourceId) REFERENCES ressources(idRessource) ON DELETE CASCADE
);

-- Table pour stocker les résultats des quiz
CREATE TABLE resultatsQuiz (
    idResultat INT AUTO_INCREMENT PRIMARY KEY,
    utilisateurId INT NOT NULL,
    score INT NOT NULL,
    total INT NOT NULL,
    datePassage DATETIME DEFAULT CURRENT_TIMESTAMP
);