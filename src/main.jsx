import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import App from './App'
import './index.css';
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <HeroUIProvider>
        <ToastProvider placement='top-right' />
        <App />
      </HeroUIProvider>
    </AuthProvider>
  </React.StrictMode>,
)