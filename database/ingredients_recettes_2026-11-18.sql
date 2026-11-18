-- =====================================================================
-- Ingrédients des recettes : 18 novembre 2026
-- La table recettesIngredients est vide : aucune recette n'affiche
-- d'ingrédients. Ce script :
--   1. autorise une quantité vide (les quantités seront saisies ensuite)
--      et ajoute un ordre d'affichage (la viande d'abord) ;
--   2. supprime les ingrédients en double et ceux de la blanquette de veau ;
--   3. rattache à chaque recette les ingrédients cités dans ses étapes.
--
-- Avant d'exécuter : faire un export complet de la base
-- (node scripts/exporterBase.js depuis back).
-- Exécution, depuis back :
--   node scripts/executerSql.js ../database/ingredients_recettes_2026-11-18.sql
-- Les lignes supprimées sont gardées dans sauvegarde_20261118_ingredients.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Hors transaction (ALTER et CREATE TABLE valident implicitement)
-- ---------------------------------------------------------------------
ALTER TABLE recettesIngredients
  MODIFY quantiteValeur FLOAT NULL,
  ADD COLUMN ordre INT NULL AFTER unite;

CREATE TABLE IF NOT EXISTS sauvegarde_20261118_ingredients LIKE ingredients;
INSERT IGNORE INTO sauvegarde_20261118_ingredients
SELECT * FROM ingredients
WHERE idIngredient IN (4, 32, 54, 50, 52, 58, 55, 21, 22, 23, 25, 26, 27, 28, 29);

START TRANSACTION;

-- ---------------------------------------------------------------------
-- 1. Doublons : on garde un seul ingrédient par nom
--    Carottes (4)            -> Carotte (11)
--    Ail (32, 54)            -> Ail (19)
--    Sel (50)                -> Sel (38)
--    Beurre doux (52)        -> Beurre doux (9)
--    Poivre noir (58)        -> Poivre noir (39)
--    Jus de citron (55)      -> Jus de citron (40)
-- recettesIngredients est vide : aucun rattachement à déplacer.
-- ---------------------------------------------------------------------
DELETE FROM ingredients WHERE idIngredient IN (4, 32, 54, 50, 52, 58, 55);

-- ---------------------------------------------------------------------
-- 2. Ingrédients de la blanquette de veau (recette supprimée le 17/11),
--    utilisés par aucune autre recette.
--    Crème fraîche, Farine, Bouillon de légumes, Bouillon de poule,
--    Champignons de Paris, Citron, Jaune d'oeuf, Vin blanc.
-- ---------------------------------------------------------------------
DELETE FROM ingredients WHERE idIngredient IN (21, 22, 23, 25, 26, 27, 28, 29);

-- ---------------------------------------------------------------------
-- 3. Rattachements, d'après les étapes de chaque recette.
--    Quantité et unité vides : à compléter.
--    L'ordre de la liste IN est l'ordre d'affichage sur la recette.
--    Le SELECT sur recettes évite toute erreur si une recette n'existe plus.
-- ---------------------------------------------------------------------

-- Bœuf bourguignon (1)
INSERT INTO recettesIngredients (recetteId, ingredientId, quantiteValeur, unite, ordre)
SELECT 1, i.idIngredient, NULL, NULL, FIELD(i.idIngredient, 1, 2, 3, 11, 5) FROM recettes r
JOIN ingredients i ON i.idIngredient IN (1, 2, 3, 11, 5)
WHERE r.idRecette = 1;

-- Côte de bœuf au romarin (3)
INSERT INTO recettesIngredients (recetteId, ingredientId, quantiteValeur, unite, ordre)
SELECT 3, i.idIngredient, NULL, NULL, FIELD(i.idIngredient, 6, 7, 8, 9, 10) FROM recettes r
JOIN ingredients i ON i.idIngredient IN (6, 7, 8, 9, 10)
WHERE r.idRecette = 3;

-- Pot-au-feu grand-mère (4)
INSERT INTO recettesIngredients (recetteId, ingredientId, quantiteValeur, unite, ordre)
SELECT 4, i.idIngredient, NULL, NULL, FIELD(i.idIngredient, 15, 16, 11, 12, 13, 14, 17, 18, 19, 20, 10, 33) FROM recettes r
JOIN ingredients i ON i.idIngredient IN (15, 16, 11, 12, 13, 14, 17, 18, 19, 20, 10, 33)
WHERE r.idRecette = 4;

-- Rôti de bœuf aux herbes et ail (6)
INSERT INTO recettesIngredients (recetteId, ingredientId, quantiteValeur, unite, ordre)
SELECT 6, i.idIngredient, NULL, NULL, FIELD(i.idIngredient, 30, 31, 19, 33, 34, 35, 36, 37, 38, 39, 40) FROM recettes r
JOIN ingredients i ON i.idIngredient IN (30, 31, 19, 33, 34, 35, 36, 37, 38, 39, 40)
WHERE r.idRecette = 6;

-- Cœur de rumsteck aux trois poivres (7)
INSERT INTO recettesIngredients (recetteId, ingredientId, quantiteValeur, unite, ordre)
SELECT 7, i.idIngredient, NULL, NULL, FIELD(i.idIngredient, 41, 42, 43, 44, 45, 46, 47, 48, 49, 38) FROM recettes r
JOIN ingredients i ON i.idIngredient IN (41, 42, 43, 44, 45, 46, 47, 48, 49, 38)
WHERE r.idRecette = 7;

-- Pavé de limande grillé, beurre maître d'hôtel (8)
INSERT INTO recettesIngredients (recetteId, ingredientId, quantiteValeur, unite, ordre)
SELECT 8, i.idIngredient, NULL, NULL, FIELD(i.idIngredient, 51, 9, 53, 19, 40, 56, 57, 39, 59) FROM recettes r
JOIN ingredients i ON i.idIngredient IN (51, 9, 53, 19, 40, 56, 57, 39, 59)
WHERE r.idRecette = 8;

COMMIT;

-- ---------------------------------------------------------------------
-- Vérifications après exécution
-- ---------------------------------------------------------------------
-- Nombre d'ingrédients par recette (attendu : 1→5, 3→5, 4→12, 6→11, 7→10, 8→9)
-- SELECT recetteId, COUNT(*) FROM recettesIngredients GROUP BY recetteId;
-- Ingrédients rattachés à aucune recette (attendu : 0 ligne)
-- SELECT * FROM ingredients i WHERE NOT EXISTS
--   (SELECT 1 FROM recettesIngredients ri WHERE ri.ingredientId = i.idIngredient);
-- Noms en double (attendu : 0 ligne)
-- SELECT nomIngredient, COUNT(*) FROM ingredients GROUP BY nomIngredient HAVING COUNT(*) > 1;
