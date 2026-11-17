// Exécute un fichier SQL sur la base configurée dans back/.env, après confirmation.
// Usage, depuis le dossier back : node scripts/executerSql.js ../database/corrections_2026-11-17.sql
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const fichier = process.argv[2];
if (!fichier || !fs.existsSync(fichier)) {
  console.error("Indiquez un fichier SQL existant. Exemple : node scripts/executerSql.js ../database/corrections_2026-11-17.sql");
  process.exit(1);
}

const sql = fs.readFileSync(fichier, "utf8");
const saisie = readline.createInterface({ input: process.stdin, output: process.stdout });
const reponse = await saisie.question(
  `Exécuter ${path.basename(fichier)} sur la base « ${process.env.DB_NAME} » ? Cette action écrit dans la base. Tapez OUI pour continuer : `
);
saisie.close();
if (reponse.trim() !== "OUI") {
  console.log("Annulé, rien n'a été modifié.");
  process.exit(0);
}

const local = ["localhost", "127.0.0.1"].includes(process.env.DB_HOST);
let connexion;
try {
  connexion = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: local ? undefined : { rejectUnauthorized: false },
  multipleStatements: true,
  });
} catch (erreur) {
  console.error("Connexion à la base impossible :", erreur.message);
  process.exit(1);
}

try {
  await connexion.query(sql);
  console.log("Script exécuté sans erreur.");
} catch (erreur) {
  console.error("Erreur, la transaction a été annulée :", erreur.message);
  process.exitCode = 1;
} finally {
  await connexion.end();
}
