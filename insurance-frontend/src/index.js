import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // <-- 1. IMPORT

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- 2. ADD THIS WRAPPER */}
      <App />
    </BrowserRouter> {/* <-- 3. AND THIS WRAPPER */}
  </React.StrictMode>
);

reportWebVitals();
