import React, { useState, useRef, useEffect } from 'react';
import chatheadImage from '../../assets/images/webp/chathead.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './ChatHead.css';

function ChatHead() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [position, setPosition] = useState(null);

  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const toggleChat = () => {
    if (!dragging.current) {
      setIsChatOpen((prev) => !prev);
    }
  };

  const getInitialPosition = () => {
    return {
      x: window.innerWidth - 30 - 60,
      y: window.innerHeight - 20 - 60,
    };
  };

  const onMouseDown = (e) => {
    dragging.current = true;

    if (!position) {
      const initPos = getInitialPosition();
      setPosition(initPos);
      dragOffset.current = { x: e.clientX - initPos.x, y: e.clientY - initPos.y };
    } else {
      dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    if (dragging.current) {
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
  }, [position]);

  return (
    <>
      {isChatOpen && (
        <div className="chat-window">
          {/* Your existing chat window JSX */}
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

          {/* Messages and Footer ... */}
        </div>
      )}

      {/* Draggable chat toggle */}
      <div
        className="chat-toggle"
        onClick={toggleChat}
        onMouseDown={onMouseDown}
        style={
          position
            ? {
                position: 'fixed',
                left: position.x,
                top: position.y,
                bottom: 'auto',
                right: 'auto',
                cursor: 'grab',
                userSelect: 'none',
              }
            : {}
        }
      >
        {/* Show bubble only if chat is closed */}
        {!isChatOpen && <div className="chat-label">Need Help?</div>}

        <div className="chat-icon">
          <img src={chatheadImage} alt="Chat Head" className="chat-image" />
        </div>
      </div>
    </>
  );
}

export default ChatHead;
