
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  // Registrar Service Worker para PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.error('SW registration failed:', err);
      });
    });
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Falha na renderização:", error);
    rootElement.innerHTML = `
      <div style="background: #020617; color: #00f2ff; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif;">
        <h1 style="border: 1px solid #00f2ff; padding: 20px;">CRITICAL_RENDER_ERROR</h1>
        <p style="opacity: 0.7;">Os módulos de interface falharam ao carregar.</p>
        <button onclick="window.location.reload()" style="background: #00f2ff; color: black; border: none; padding: 12px 24px; font-weight: bold; cursor: pointer; margin-top: 20px;">REBOOT SYSTEM</button>
      </div>
    `;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
