import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  // 1. Styles globaux
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
          beige: { value: "#F4EBD9" },
          brun: { value: "#B87333" },
        },
      },
      fonts: {
        body: { value: "'Roboto', sans-serif" },
        title: { value: "'Playfair Display', serif" },
      },
    },
  },
});