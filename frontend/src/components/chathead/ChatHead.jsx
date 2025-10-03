// frontend\src\components\chathead\ChatHead.jsx
import React, { useState, useRef, useEffect } from 'react';
import chatheadImage from '../../assets/images/webp/chathead.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './ChatHead.css'; // Make sure this line is present

function ChatHead() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'user', text: 'test', time: '6 months ago' },
    { sender: 'bot', text: 'I understand your concern. Let me look into that for you.', time: '6 months ago' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);


  const chatToggleRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 30, y: 20 });
  const offsetRef = useRef({ x: 0, y: 0 });


  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = chatToggleRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };
  
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const newX = e.clientX - offsetRef.current.x;
    const newY = e.clientY - offsetRef.current.y;
  
    setPosition({
      x: Math.max(0, newX),
      y: Math.max(0, newY),
    });
  };
  
  const handleMouseUp = () => {
    setDragging(false);
  };
  
  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);
  

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed === '') return;

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: trimmed, time: 'just now' },
      { sender: 'bot', text: 'typing', time: '', typing: true }
    ]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.typing);
        return [
          ...filtered,
          { sender: 'bot', text: 'How can I help you?', time: 'just now' }
        ];
      });
      setIsTyping(false);
    }, 2000);
  };

  return (
    <>
      {isChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-left">
              <img src={chatheadImage} alt="Support" className="chat-avatar" />
              <div>
                <div className="chat-title always-black">Live Support</div>
                <div className="chat-status">● online</div>
              </div>
            </div>
            <div className="chat-close" onClick={toggleChat}>×</div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message-row ${msg.sender}`}>
                <div className={`chat-bubble ${msg.sender}`}>
                  {msg.typing ? (
                    <div className="typing-indicator">
                      <span className="dot" />
                      <span className="dot delay1" />
                      <span className="dot delay2" />
                    </div>
                  ) : (
                    <>
                      {msg.text}
                      <div className="chat-time">{msg.time}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="chat-input always-black"
            />
            <button onClick={handleSend} className="send-button">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}

      {/* <div className="chat-toggle" onClick={toggleChat}>
        {!isChatOpen && <div className="chat-label">Need Help?</div>}
        <div className="chat-icon">
          <img src={chatheadImage} alt="Chat Head" className="chat-image" />
        </div>
      </div> */}

      <div
        className="chat-toggle"
        ref={chatToggleRef}
        onMouseDown={handleMouseDown}
        style={{ right: position.x, bottom: position.y, position: 'fixed' }}
      >
        {!isChatOpen && <div className="chat-label">Need Help?</div>}
        <div className="chat-icon">
          <img src={chatheadImage} alt="Chat Head" className="chat-image" />
        </div>
      </div>

    </>
  );
}

export default ChatHead;
