import React from 'react';
import logoSpindle from '../img/logospindle.png';

const Header = () => {
  return (
    <header className="chat-header">
      <img src={logoSpindle} alt="Logo Spindle" />
      <h1>Assistente Spindle</h1>
    </header>
  );
};

export default Header;