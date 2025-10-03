import React, { useState, useRef, useEffect } from 'react';
import chatheadImage from '../../assets/images/webp/chathead.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './ChatHead.css';

function ChatHead() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  // Drag position state: null means default bottom-right position from CSS
  const [position, setPosition] = useState(null);

  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const toggleChat = () => {
    if (!dragging.current) {
      setIsChatOpen((prev) => !prev);
    }
  };

  // Convert default bottom-right CSS to left/top pixel position on first drag
  const getInitialPosition = () => {
    return {
      x: window.innerWidth - 30 - 60, // right: 30px + width:60px
      y: window.innerHeight - 20 - 60, // bottom: 20px + height:60px
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
          {/* Your existing chat window code here */}
        </div>
      )}

      {/* Your exact preserved chat-toggle JSX */}
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
        {!isChatOpen && <div className="chat-label">Need Help?</div>}
        <div className="chat-icon">
          <img src={chatheadImage} alt="Chat Head" className="chat-image" />
        </div>
      </div>
    </>
  );
}

export default ChatHead;
