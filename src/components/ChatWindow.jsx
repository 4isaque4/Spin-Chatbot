import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const ChatWindow = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef(null);

  // Rola para a última mensagem automaticamente
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
      {isLoading && <div className="typing-indicator">Digitando...</div>}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatWindow;