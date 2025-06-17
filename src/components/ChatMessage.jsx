import React from 'react';

const ChatMessage = ({ message }) => {
  const messageClass = message.sender === 'user' ? 'user-message' : 'bot-message';
  return (
    <div className={`message ${messageClass}`}>
      {message.text}
    </div>
  );
};

export default ChatMessage;