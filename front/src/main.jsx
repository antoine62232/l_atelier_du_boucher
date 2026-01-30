import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import theme from './theme.js' // Ton fichier thème avec les couleurs

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. On injecte le thème Chakra pour tout le site */}
    <ChakraProvider theme={theme}>
      {/* 2. On active le système de navigation */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
)