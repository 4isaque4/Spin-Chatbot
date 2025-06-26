import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import './styles/global.css';
import './styles/layout.css';
import './styles/login.css';
import './styles/sidebar.css';
import './styles/chat.css';
import './styles/modal.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);