import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// --- CORREÇÃO AQUI ---
// Esta linha É OBRIGATÓRIA.
// Ela diz ao Vite para carregar o seu arquivo de CSS
// com o novo fundo azul claro (bg-background).
import './index.css' 
// --- FIM DA CORREÇÃO ---

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

