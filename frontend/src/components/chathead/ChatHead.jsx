import React, { useState, useRef, useEffect } from 'react';
import chatheadImage from '../../assets/images/webp/chathead.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './ChatHead.css';

function ChatHead() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'user', text: 'test', time: '6 months ago' },
    { sender: 'bot', text: 'I understand your concern. Let me look into that for you.', time: '6 months ago' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  // Position state for draggable chat toggle, null means using default CSS bottom/right
  const [position, setPosition] = useState(null); 

  // To track drag offset between mouse and toggle element
  const dragOffset = useRef({ x: 0, y: 0 });

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

  // Convert bottom/right initial CSS to left/top pixels based on window size & chat-toggle size
  const convertBottomRightToLeftTop = () => {
    const toggle = document.querySelector('.chat-toggle');
    if (!toggle) return { x: window.innerWidth - 30 - 60, y: window.innerHeight - 20 - 60 };
    const rect = toggle.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    // If first drag, convert bottom/right to left/top coords
    if (position === null) {
      const { x, y } = convertBottomRightToLeftTop();
      setPosition({ x, y });
      dragOffset.current = { x: e.clientX - x, y: e.clientY - y };
    } else {
      dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
    setIsDragging(true);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Attach global mousemove and mouseup handlers when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

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

      {/* <div
        className="chat-toggle"
        onClick={() => !isDragging && toggleChat()}
        onMouseDown={onMouseDown}
        style={
          position
            ? { position: 'fixed', left: position.x, top: position.y, bottom: 'auto', right: 'auto' }
            : undefined
        }
      >
        {!isChatOpen && <div className="chat-label">Need Help?</div>}
        <div className="chat-icon">
          <img src={chatheadImage} alt="Chat Head" className="chat-image" />
        </div>

      </div> */}


      <div className="chat-toggle" 
        onClick={toggleChat}
        onMouseDown={onMouseDown}
        style={
          position
            ? { position: 'fixed', left: position.x, top: position.y, bottom: 'auto', right: 'auto' }
            : undefined
        }
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
