import { createSystem, defaultConfig, defineRecipe } from "@chakra-ui/react";

const button = defineRecipe({
  base: {
    fontWeight: "600",
    letterSpacing: "0.01em",
    transitionProperty: "common",
    transitionDuration: "moderate",
    focusVisibleRing: "outside",
    focusRingColor: "brand.brun",
  },
  variants: {
    size: {
      md: { h: "11", minW: "11", px: "5", textStyle: "sm" },
      lg: { h: "12", minW: "12", px: "6", textStyle: "md" },
    },
  },
});

export const system = createSystem(defaultConfig, {
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
      backgroundColor: "brand.beige",
      color: "brand.gris",
      minHeight: "100vh",
      fontFamily: "body",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      textRendering: "optimizeLegibility",
    },
    "h1, h2, h3": {
      fontFamily: "title",
    },
    "::selection": {
      backgroundColor: "brand.rouge",
      color: "brand.creme",
    },
    ":focus-visible": {
      outline: "2px solid {colors.brand.brun}",
      outlineOffset: "2px",
    },
  },

  theme: {
    tokens: {
      colors: {
        brand: {
          rouge: { value: "#8A1C25" },
          rougeFonce: { value: "#581218" },
          creme: { value: "#FFFCF5" },
          gris: { value: "#2C3E50" },
          acier: { value: "#AAB7B8" },
          beige: { value: "#F4EBD9" },
          brun: { value: "#B87333" },
          fond: { value: "#F4EBD9" },
        },
      },
      fonts: {
        body: { value: "'Roboto', system-ui, -apple-system, 'Segoe UI', sans-serif" },
        heading: { value: "'Playfair Display', Georgia, serif" },
        title: { value: "'Playfair Display', Georgia, serif" },
      },
      shadows: {
        carte: { value: "0 1px 2px rgba(44, 62, 80, 0.06), 0 8px 24px rgba(44, 62, 80, 0.08)" },
        carteSurvol: { value: "0 2px 4px rgba(44, 62, 80, 0.08), 0 16px 40px rgba(44, 62, 80, 0.14)" },
      },
    },
    recipes: {
      button,
    },
  },
});
