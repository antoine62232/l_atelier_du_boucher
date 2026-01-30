import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- IMPORTANT : Import du Router
import { ChakraProvider } from '@chakra-ui/react'
import { system } from './theme.js'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. On fournit le système de design (Chakra) */}
    <ChakraProvider value={system}>
      
      {/* 2. On fournit le système de routage (React Router) */}
      {/* C'est LUI qui manquait et qui causait l'erreur "basename" */}
      <BrowserRouter>
        <App />
      </BrowserRouter>

    </ChakraProvider>
  </React.StrictMode>,
)