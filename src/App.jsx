// src/App.jsx

import React from 'react';
import Header from './components/Header.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import Sidebar from './components/Sidebar.jsx';
import { useDifyAPI } from './hooks/userDifyAPI.js'; // A correção está aqui
import './styles.css';

function App() {
  const { 
    conversations, 
    activeConversationId, 
    isLoading, 
    sendMessage, 
    switchConversation, 
    startNewConversation 
  } = useDifyAPI();

  // Encontra a conversa ativa para passar as mensagens corretas
  const activeConversation = conversations.find(c => c.id === activeConversationId) || { messages: [] };

  return (
    <div className="app-layout">
      <Sidebar 
        conversations={conversations}
        activeConversationId={activeConversationId}
        switchConversation={switchConversation}
        startNewConversation={startNewConversation}
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