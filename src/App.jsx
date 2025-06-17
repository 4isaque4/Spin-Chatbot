import React from 'react';
import Header from './components/Header.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import { useDifyAPI } from './hooks/userDifyAPI.js';
import './styles.css';

function App() {
  const { messages, isLoading, sendMessage } = useDifyAPI();

  return (
    <div className="chat-container">
      <Header />
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;