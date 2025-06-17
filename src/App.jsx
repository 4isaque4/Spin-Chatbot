// src/App.jsx

import React from 'react';
import Header from './components/Header.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import Sidebar from './components/Sidebar.jsx';
import { useDifyAPI } from './hooks/userDifyAPI.js';
import './styles.css';

function App() {
  const { 
    conversations, 
    activeConversationId, 
    isLoading, 
    sendMessage, 
    switchConversation, 
    startNewConversation,
    renameConversation, // <-- Nova função
    deleteConversation  // <-- Nova função
  } = useDifyAPI();

  const activeConversation = conversations.find(c => c.id === activeConversationId) || { messages: [] };

  return (
    <div className="app-layout">
      <Sidebar 
        conversations={conversations}
        activeConversationId={activeConversationId}
        switchConversation={switchConversation}
        startNewConversation={startNewConversation}
        renameConversation={renameConversation} // <-- Passando a prop
        deleteConversation={deleteConversation} // <-- Passando a prop
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