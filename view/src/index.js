import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

if (typeof window !== 'undefined' && window.trustedTypes && window.trustedTypes.createPolicy) {
  try {
    // Mengecek jika kebijakan 'default' belum ada, barulah dibuat
    if (!window.trustedTypes.getPolicyNames || 
        (window.trustedTypes.getPolicyNames && !window.trustedTypes.getPolicyNames().includes('default'))) {
      window.trustedTypes.createPolicy('default', {
        createHTML: (input) => input,
        createScriptURL: (url) => url,
        createScript: (script) => script
      });
    }
  } catch (error) {
    console.error("Error creating Trusted Types policy:", error);
  }
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <React.StrictMode>
      <App />
    </React.StrictMode>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
