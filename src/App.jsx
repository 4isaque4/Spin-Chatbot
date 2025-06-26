// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import Sidebar from './components/Sidebar.jsx';
import Login from './components/Login.jsx'; 
import { useDifyAPI } from './hooks/userDifyAPI.js'; 

// A linha 'import "./styles.css";' foi removida daqui, pois agora os estilos são importados em 'main.jsx'.

// Componente simples para tela de carregamento
const LoadingScreen = () => (
  <div className="loading-screen">
    <p>Verificando sessão...</p>
  </div>
);

function App() {
  const [authStatus, setAuthStatus] = useState('loading'); // 'loading', 'authenticated', 'unauthenticated'

  // Verifica a validade do token ao carregar a página
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('spinAuthToken');
      if (!token) {
        setAuthStatus('unauthenticated');
        return;
      }

      try {
        // Chama a nova rota de verificação no nosso backend
        const response = await fetch('http://localhost:3001/api/verify-token', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setAuthStatus('authenticated');
        } else {
          localStorage.removeItem('spinAuthToken'); // Remove o token inválido
          setAuthStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Servidor de autenticação offline ou inacessível.', error);
        // Em caso de erro de rede, assume como deslogado
        setAuthStatus('unauthenticated');
      }
    };

    verifySession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('spinAuthToken');
    setAuthStatus('unauthenticated');
  };

  const { 
    conversations, 
    activeConversationId, 
    isLoading, 
    sendMessage, 
    switchConversation, 
    startNewConversation,
    renameConversation,
    deleteConversation
  } = useDifyAPI();

  const activeConversation = conversations.find(c => c.id === activeConversationId) || { messages: [] };

  if (authStatus === 'loading') {
    return <LoadingScreen />;
  }
  
  if (authStatus === 'unauthenticated') {
    return <Login onLoginSuccess={() => setAuthStatus('authenticated')} />;
  }
  
  return (
    <div className="app-layout">
      <Sidebar 
        conversations={conversations}
        activeConversationId={activeConversationId}
        switchConversation={switchConversation}
        startNewConversation={startNewConversation}
        renameConversation={renameConversation}
        deleteConversation={deleteConversation}
        onLogout={handleLogout}
      />
      <div className="chat-container">
        <Header />
        <ChatWindow messages={activeConversation.messages} isLoading={isLoading} />
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;
