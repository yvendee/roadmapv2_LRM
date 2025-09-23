import React, { useState, useRef, useEffect } from 'react';
import chatheadImage from '../../assets/images/webp/chathead.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function ChatHead() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'user', text: 'test', time: '6 months ago' },
    { sender: 'bot', text: 'I understand your concern. Let me look into that for you.', time: '6 months ago' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to the bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed === '') return;

    const userMessage = {
      sender: 'user',
      text: trimmed,
      time: 'just now',
    };

    // Console log user message
    console.log('User message:', trimmed);

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot typing
    setIsTyping(true);

    // Add typing indicator
    setMessages(prev => [
      ...prev,
      { sender: 'bot', text: 'typing', time: '', typing: true }
    ]);

    // Replace typing with actual response after 2s
    setTimeout(() => {
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.typing);
        return [
          ...filtered,
          {
            sender: 'bot',
            text: 'How can I help you?',
            time: 'just now',
          }
        ];
      });
      setIsTyping(false);
    }, 2000);
  };

  const dotStyle = {
    width: '6px',
    height: '6px',
    backgroundColor: '#999',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'blink 1.4s infinite',
  };
  
  

  return (
    <>

      <style>
        {`
          @keyframes blink {
            0%, 80%, 100% { opacity: 0.3; }
            40% { opacity: 1; }
          }
        `}
      </style>

      {isChatOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '320px',
            maxHeight: '480px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'sans-serif',
            zIndex: 10000,
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#f7f7f7',
              padding: '10px 15px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={chatheadImage}
                alt="Support"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  marginRight: '10px',
                }}
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>Live Support</div>
                <div style={{ fontSize: '12px', color: 'green' }}>● online</div>
              </div>
            </div>
            <div
              style={{ cursor: 'pointer', fontSize: '18px' }}
              onClick={toggleChat}
            >
              ×
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: '10px',
              overflowY: 'auto',
              backgroundColor: '#f9f9f9',
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    backgroundColor: msg.sender === 'user' ? '#e6f0ff' : '#fff',
                    padding: '10px',
                    borderRadius: '10px',
                    border: msg.sender === 'bot' && !msg.typing ? '1px solid #ddd' : 'none',
                    fontStyle: msg.typing ? 'italic' : 'normal',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    position: 'relative',
                    fontSize: '14px',
                    color: '#333',
                  }}
                >
                  {msg.typing ? (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={dotStyle}></span>
                      <span style={{ ...dotStyle, animationDelay: '0.2s' }}></span>
                      <span style={{ ...dotStyle, animationDelay: '0.4s' }}></span>
                    </div>
                  ) : (
                    msg.text
                  )}
                  {!msg.typing && (
                    <div
                      style={{
                        fontSize: '10px',
                        color: '#999',
                        textAlign: 'right',
                        marginTop: '4px',
                      }}
                    >
                      {msg.time}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* Scroll target */}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div
            style={{
              borderTop: '1px solid #e0e0e0',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                border: '1px solid #ccc',
                borderRadius: '20px',
                padding: '8px 12px',
                fontSize: '14px',
                outline: 'none',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button
              onClick={handleSend}
              style={{
                marginLeft: '8px',
                backgroundColor: '#3B82F6',
                border: 'none',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}

      {/* Chat Head with "Need Help" */}
      <div
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        {!isChatOpen && (
          <div
            style={{
              marginRight: '10px',
              backgroundColor: '#3B82F6',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            Need Help?
          </div>
        )}

        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#fff',
            border: '2px solid white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          <img
            src={chatheadImage}
            alt="Chat Head"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
    </>
  );
}

export default ChatHead;
