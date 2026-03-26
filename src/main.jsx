import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { GoogleOAuthProvider } from '@react-oauth/google'


import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_google_client_id_here.apps.googleusercontent.com"}>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Toaster position="top-right" reverseOrder={false} />
      </Provider>
    </BrowserRouter>
  </GoogleOAuthProvider>
)
