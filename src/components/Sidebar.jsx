// src/components/Sidebar.jsx

import React from 'react';

const Sidebar = ({ conversations, activeConversationId, switchConversation, startNewConversation }) => {
  return (
    <div className="sidebar">
      <button className="new-chat-button" onClick={startNewConversation}>
        + Nova Conversa
      </button>
      <div className="sidebar-title">Conversas</div>
      <ul className="conversation-list">
        {conversations.map(conv => (
          <li
            key={conv.id}
            className={`conversation-item ${conv.id === activeConversationId ? 'active' : ''}`}
            onClick={() => switchConversation(conv.id)}
          >
            {conv.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;