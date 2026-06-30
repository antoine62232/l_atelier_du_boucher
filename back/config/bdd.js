import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Chargement des variables d'environnement
dotenv.config();

const connexion = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

// Test de connexion (optionnel mais recommandé au début)
connexion.getConnection();
try {
    console.log("✅ Connecté à la base de données 'atelier_boucher'");
} catch (error) {
    console.error("❌ Erreur de connexion BDD :", error);
}

export default connexion;