import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      rouge: "#8A1C25",
      beige: "#F4EBD9",
      gris: "#2C3E50",
      brun: "#B87333",
      acier: "#AAB7B8",
      creme: "#FFFCF5",
    },
  },
  fonts: {
    titre: `'Playfair Display', serif`,
    body: `'Roboto', sans-serif`,
  },
})

export default theme