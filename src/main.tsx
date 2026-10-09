import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/fonts.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './style.css'
import './styles/site-footer.css'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
