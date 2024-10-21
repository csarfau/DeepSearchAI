// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId="671567557134-pskdc8dch3lc6keu2c8hkq05ttelld0s.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  // </StrictMode>,
)
