// src/components/chathead/ChatHead.jsx
import React, { useState } from 'react';
import './ChatHead.css';  

function ChatHead() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      {/* Chat Head */}
      <div
        className="chathead"
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundImage: 'url(src/assets/images/webp/chathead.webp)',
          backgroundSize: 'cover',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      ></div>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Live Support</h3>
            <span onClick={toggleChat} className="close-chat">
              X
            </span>
          </div>
          <div className="chat-content">
            <div className="message">
              <span className="user">User:</span>
              <p>test</p>
            </div>
            <div className="message">
              <span className="support">Live Support:</span>
              <p>I understand your concern. Let me look into that for you.</p>
            </div>
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type your message..."
              className="chat-input"
            />
            <button className="send-button">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatHead;
