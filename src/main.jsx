import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lib/styles/index.css'
import App from './App.jsx'
import "./i18n";
import React from 'react'
import {AuthProvider} from "./context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
    <AuthProvider>
    <App />
  </AuthProvider>,
)
