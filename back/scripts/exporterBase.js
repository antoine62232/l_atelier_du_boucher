// Export complet de la base (structure et données) dans un fichier .sql.
// Usage, depuis le dossier back : node scripts/exporterBase.js
// Le fichier part dans back/sauvegardes/, ignoré par Git : il contient des données personnelles.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const dossier = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "sauvegardes");
const d = new Date();
const deux = (n) => String(n).padStart(2, "0");
const horodatage = `${d.getFullYear()}${deux(d.getMonth() + 1)}${deux(d.getDate())}_${deux(d.getHours())}${deux(d.getMinutes())}`;
const fichier = path.join(dossier, `${process.env.DB_NAME}_${horodatage}.sql`);
const local = ["localhost", "127.0.0.1"].includes(process.env.DB_HOST);
const PAQUET = 200; // lignes par INSERT

let connexion;
try {
  connexion = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: local ? undefined : { rejectUnauthorized: false },
    // Dates et décimaux exportés tels qu'en base, sans conversion de fuseau ni d'arrondi.
    dateStrings: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
  });
} catch (erreur) {
  console.error("Connexion à la base impossible :", erreur.message);
  process.exit(1);
}

// Aiven active ANSI_QUOTES : SHOW CREATE TABLE sortirait alors des "guillemets" que les autres
// serveurs MySQL lisent comme du texte. On force les accents graves, lisibles partout.
const [[{ modeServeur }]] = await connexion.query("SELECT @@SESSION.sql_mode AS modeServeur");
const modeSansAnsi = modeServeur
  .split(",")
  .filter((m) => m && m !== "ANSI" && m !== "ANSI_QUOTES")
  .join(",");
await connexion.query("SET SESSION sql_mode = ?", [modeSansAnsi]);
const [[{ mode }]] = await connexion.query("SELECT @@SESSION.sql_mode AS mode");

fs.mkdirSync(dossier, { recursive: true });
const sortie = fs.createWriteStream(fichier, { encoding: "utf8" });
const ecrire = (texte) => new Promise((ok) => (sortie.write(texte) ? ok() : sortie.once("drain", ok)));

try {
  const [tables] = await connexion.query(
    "SELECT TABLE_NAME AS nom FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME"
  );

  await ecrire(
    `-- Export de la base ${process.env.DB_NAME}, ${new Date().toLocaleString("fr-FR")}\n` +
      `-- ${tables.length} tables. Restauration : node scripts/executerSql.js <ce fichier>\n\n` +
      "SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS = 0;\nSET SESSION sql_mode = 'NO_AUTO_VALUE_ON_ZERO';\n\n"
  );

  const bilan = [];
  for (const { nom } of tables) {
    const [[creation]] = await connexion.query(`SHOW CREATE TABLE \`${nom}\``);
    await ecrire(`-- Table ${nom}\nDROP TABLE IF EXISTS \`${nom}\`;\n${creation["Create Table"]};\n\n`);

    const [lignes, champs] = await connexion.query(`SELECT * FROM \`${nom}\``);
    const colonnes = champs.map((c) => `\`${c.name}\``).join(", ");
    for (let i = 0; i < lignes.length; i += PAQUET) {
      const valeurs = lignes
        .slice(i, i + PAQUET)
        .map((ligne) => connexion.format(`(${champs.map(() => "?").join(", ")})`, champs.map((c) => ligne[c.name])))
        .join(",\n");
      await ecrire(`INSERT INTO \`${nom}\` (${colonnes}) VALUES\n${valeurs};\n`);
    }
    await ecrire("\n");
    bilan.push({ table: nom, lignes: lignes.length });
  }

  await ecrire("SET FOREIGN_KEY_CHECKS = 1;\n\n-- Nombre de lignes exportées\n");
  for (const { table, lignes } of bilan) await ecrire(`-- ${table}: ${lignes}\n`);
  await new Promise((ok) => sortie.end(ok));

  console.table(bilan);
  const doublons = bilan.filter((a, i) => bilan.some((b, j) => j < i && b.table.toLowerCase() === a.table.toLowerCase()));
  if (doublons.length) console.warn("Attention, tables dont le nom ne diffère que par la casse :", doublons.map((d) => d.table).join(", "));
  if (mode.includes("ANSI")) console.warn("Mode ANSI encore actif, vérifiez les guillemets du fichier.");
  const taille = (fs.statSync(fichier).size / 1024).toFixed(1);
  console.log(`Export terminé : ${fichier} (${taille} Ko)`);
} catch (erreur) {
  sortie.destroy();
  fs.rmSync(fichier, { force: true });
  console.error("L'export a échoué, aucun fichier n'a été gardé :", erreur.message);
  process.exitCode = 1;
} finally {
  await connexion.end();
}
