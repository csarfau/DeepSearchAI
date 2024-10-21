// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId="690517003113-6ofbi6qj0rm9hplt1964s7g8dlmtm77a.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  // </StrictMode>,
)
