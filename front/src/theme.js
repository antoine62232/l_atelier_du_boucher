import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  // 1. Styles globaux (Le fond prendra la couleur brand.beige définie plus bas)
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
      backgroundColor: "brand.beige", 
      color: "brand.gris",
      minHeight: "100vh",
    },
  },

  // 2. Définition des couleurs
  theme: {
    tokens: {
      colors: {
        brand: {
          rouge: { value: "#8A1C25" },
          creme: { value: "#FFFCF5" },
          gris: { value: "#2C3E50" },
          acier: { value: "#AAB7B8" },
          beige: { value: "#F4EBD9" }, // <--- C'est corrigé ici !
          brun: { value: "#8B4513" },
        },
      },
      fonts: {
        heading: { value: "'Playfair Display', serif" },
        body: { value: "'Inter', sans-serif" },
        titre: { value: "'Playfair Display', serif" },
      },
    },
  },
});