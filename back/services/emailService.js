import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Création du transporteur
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"L'Atelier du Boucher" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: html
        });
        console.log("Message envoyé : %s", info.messageId);
    } catch (error) {
        console.error("Erreur lors de l'envoi du mail :", error);
    }
};