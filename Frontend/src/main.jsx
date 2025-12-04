import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx' // <--- Import the Provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the entire App in AuthProvider so every page can access user state */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)