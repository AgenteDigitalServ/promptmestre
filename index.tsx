
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Falha crítica: Elemento #root não encontrado no DOM.");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("PROMPT MESTRE: Sistema inicializado com sucesso.");
  } catch (error) {
    console.error("Erro durante a renderização da aplicação:", error);
    rootElement.innerHTML = `
      <div style="color: white; padding: 20px; font-family: sans-serif; text-align: center; margin-top: 20vh;">
        <h1 style="color: #00f2ff;">Erro de Inicialização</h1>
        <p>Houve uma falha ao carregar os módulos neurais.</p>
        <p style="font-size: 12px; opacity: 0.5;">Consulte o console do desenvolvedor para detalhes técnicos.</p>
        <button onclick="window.location.reload()" style="background: #00f2ff; color: black; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 20px;">
          Reiniciar Sistemas
        </button>
      </div>
    `;
  }
};

// Garantir que o DOM está pronto antes de montar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
