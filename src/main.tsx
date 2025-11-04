import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// --- CORREÇÃO AQUI ---
// Esta linha diz ao seu projeto para carregar o
// arquivo de CSS com as nossas novas cores de fundo.
import './index.css' 
// --- FIM DA CORREÇÃO ---

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

