import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './global.css' // Tailwind 

import { DiveContextProvider } from './contexts/DiveContext.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { UnitContextProvider } from './contexts/UnitContext.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <DiveContextProvider>
        <UnitContextProvider>
          <App />
        </UnitContextProvider>
      </DiveContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
)
