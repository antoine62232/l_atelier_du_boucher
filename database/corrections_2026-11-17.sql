-- =====================================================================
-- Corrections du contenu : 17 novembre 2026
-- L'application ne traite que le bœuf : on retire le contenu veau et
-- agneau, les données de test, et on corrige les rattachements faux.
--
-- Avant d'exécuter : faire un export complet de la base.
-- Le script sauvegarde aussi chaque ligne modifiée ou supprimée dans
-- des tables sauvegarde_20261117_* (à supprimer quand tout est validé).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Sauvegardes (hors transaction : CREATE TABLE valide implicitement)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sauvegarde_20261117_recettes LIKE recettes;
INSERT IGNORE INTO sauvegarde_20261117_recettes SELECT * FROM recettes WHERE idRecette IN (2, 3, 7);

CREATE TABLE IF NOT EXISTS sauvegarde_20261117_instructions LIKE instructions;
INSERT IGNORE INTO sauvegarde_20261117_instructions SELECT * FROM instructions WHERE recetteId = 2;

CREATE TABLE IF NOT EXISTS sauvegarde_20261117_questions LIKE questions;
INSERT IGNORE INTO sauvegarde_20261117_questions SELECT * FROM questions WHERE idQuestion IN (1, 2, 4, 6);

CREATE TABLE IF NOT EXISTS sauvegarde_20261117_ressources LIKE ressources;
INSERT IGNORE INTO sauvegarde_20261117_ressources SELECT * FROM ressources WHERE idRessource IN (4, 5);

CREATE TABLE IF NOT EXISTS sauvegarde_20261117_actualites LIKE actualites;
INSERT IGNORE INTO sauvegarde_20261117_actualites SELECT * FROM actualites WHERE idActualite IN (1, 2, 3, 4, 5, 12);

CREATE TABLE IF NOT EXISTS sauvegarde_20261117_faq LIKE faq;
INSERT IGNORE INTO sauvegarde_20261117_faq SELECT * FROM faq;

CREATE TABLE IF NOT EXISTS sauvegarde_20261117_termes LIKE termes;
INSERT IGNORE INTO sauvegarde_20261117_termes SELECT * FROM termes WHERE idTerme = 1;

START TRANSACTION;

-- ---------------------------------------------------------------------
-- 1. Recettes
-- ---------------------------------------------------------------------
-- La blanquette de veau n'a pas sa place dans un atlas du bœuf.
-- Ses 7 étapes partent avec elle (ON DELETE CASCADE), ses favoris aussi.
DELETE FROM recettesIngredients WHERE recetteId = 2;
DELETE FROM recettes WHERE idRecette = 2;

-- La côte de bœuf vient du train de côtes, pas du dessus de palette.
UPDATE recettes SET pieceId = 24 WHERE idRecette = 3;

-- Orthographe : rumsteck.
UPDATE recettes SET titre = 'Cœur de rumsteck aux trois poivres' WHERE idRecette = 7;

-- ---------------------------------------------------------------------
-- 2. Vidéos
-- ---------------------------------------------------------------------
-- Le désossage de la cuisse n'a rien à voir avec les basses côtes.
-- Rattaché au cœur de rumsteck, que le désossage de la cuisse permet de sortir.
UPDATE ressources
SET pieceId = 18, titre = 'Désossage de la cuisse de bœuf, spécial apprenti'
WHERE idRessource = 5;

UPDATE ressources SET titre = 'Basse côte à griller d''Angus' WHERE idRessource = 4;

-- ---------------------------------------------------------------------
-- 3. Quiz : questions
-- ---------------------------------------------------------------------
-- Question 1 : doublon de la question 6, et rattachée au jarret avant.
DELETE FROM questions WHERE idQuestion = 1;

-- Question 6 : l'entrecôte se trouve dans le milieu de train de côtes.
UPDATE questions SET pieceId = 24 WHERE idQuestion = 6;

-- Question 2 : portait sur le veau. Réécrite pour le bœuf.
UPDATE questions
SET texteQuestion = 'La tende de tranche se trouve-t-elle dans l''avant du bœuf ?',
    typeQuestion = 'Vrai/Faux',
    explication = 'Faux. La tende de tranche fait partie de la cuisse, à l''arrière. C''est une viande maigre à rôtir ou à griller : rôti, steak, carpaccio.',
    pieceId = NULL, partieId = 9, animalId = NULL, raceId = NULL
WHERE idQuestion = 2;

-- Question 4 : portait sur l'agneau. Réécrite pour le bœuf.
UPDATE questions
SET texteQuestion = 'Quel est le muscle le plus tendre du bœuf ?',
    typeQuestion = 'QCM',
    explication = 'Le filet. C''est le muscle le moins sollicité par l''animal : très tendre, maigre et sans nerf. On en tire le chateaubriand et les tournedos.',
    pieceId = 22, partieId = NULL, animalId = NULL, raceId = NULL
WHERE idQuestion = 4;

-- ---------------------------------------------------------------------
-- 4. Quiz : réponses (la table était vide, aucune question ne s'affichait)
-- ---------------------------------------------------------------------
DELETE FROM reponsesQcm WHERE questionId IN (2, 4, 5, 6, 7);

INSERT INTO reponsesQcm (texteReponse, resultatReponse, questionId) VALUES
('Vrai', 0, 2),
('Faux', 1, 2),

('Le filet', 1, 4),
('Le paleron', 0, 4),
('Le jarret', 0, 4),
('Le tendron', 0, 4),

('Blanche ou crème', 1, 5),
('Rouge acajou', 0, 5),
('Pie noire', 0, 5),
('Fauve', 0, 5),

('Saignante ou à point', 1, 6),
('Bien cuite', 0, 6),
('Bouillie, comme un pot-au-feu', 0, 6),
('Braisée pendant trois heures', 0, 6),

('Le paleron', 1, 7),
('Le filet', 0, 7),
('Le faux-filet', 0, 7),
('La bavette d''aloyau', 0, 7);

-- ---------------------------------------------------------------------
-- 5. Actualités
-- ---------------------------------------------------------------------
-- 1 à 5 : saisies de test (même minute, liens et images fictifs,
-- consignes d'atelier internes, épaule d'agneau). Retirées.
DELETE FROM actualites WHERE idActualite IN (1, 2, 3, 4, 5);

-- 12 : écrite comme une boutique et cite l'agneau. Réécrite.
UPDATE actualites
SET contenu = 'Les beaux jours reviennent et avec eux les grillades. C''est le moment de conseiller au client les pièces de bœuf qui supportent la braise : côte de bœuf, entrecôte, bavette, onglet ou cœur de rumsteck. Sortir la viande du froid une heure avant, saisir fort, puis laisser reposer avant de trancher.'
WHERE idActualite = 12;

-- ---------------------------------------------------------------------
-- 6. FAQ : l'ancienne était celle d'une boucherie (saucisses, mise
-- sous vide). Remplacée par la FAQ de l'application.
-- ---------------------------------------------------------------------
DELETE FROM faq;

INSERT INTO faq (question, reponse, ordre) VALUES
('À qui s''adresse L''Atelier du Boucher ?',
 'Aux apprentis en CAP et BP boucher, à leurs formateurs et aux professionnels qui veulent réviser leurs découpes. L''application accompagne la formation en atelier, elle ne la remplace pas.', 1),
('Quelles viandes sont traitées ?',
 'Le bœuf, de la demi-carcasse jusqu''aux pièces de détail. D''autres espèces pourront venir ensuite.', 2),
('Faut-il créer un compte ?',
 'Non pour consulter l''Atlas, les vidéos, les recettes et le quiz. Un compte permet d''enregistrer ses scores, ses favoris et ses calculs de rendement.', 3),
('Puis-je l''utiliser sur téléphone ou tablette, même sans réseau ?',
 'Oui. L''application s''installe sur l''écran d''accueil comme une application classique, et les pages déjà consultées restent disponibles sans connexion, en chambre froide comme en atelier.', 4),
('D''où viennent les contenus ?',
 'Ils sont rédigés par un ancien boucher, avec dix ans de métier. Les découpes de gros suivent les supports de la filière (Interbev, Idele).', 5);

-- ---------------------------------------------------------------------
-- 7. Lexique : la seule entrée était une saisie de test.
-- ---------------------------------------------------------------------
UPDATE termes
SET nomTerme = 'Bardage',
    definition = 'Entourer une pièce maigre d''une fine tranche de lard gras, la barde, pour la protéger du dessèchement pendant la cuisson.',
    exemple = 'On barde un rôti de filet de bœuf avant de le ficeler.'
WHERE idTerme = 1;

COMMIT;

-- ---------------------------------------------------------------------
-- Vérifications après exécution (doivent renvoyer 0 ligne)
-- ---------------------------------------------------------------------
-- SELECT * FROM recettes WHERE titre LIKE '%veau%';
-- SELECT * FROM questions q WHERE NOT EXISTS (SELECT 1 FROM reponsesQcm r WHERE r.questionId = q.idQuestion);
-- SELECT * FROM actualites WHERE contenu LIKE '%agneau%';
