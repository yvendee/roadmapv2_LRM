import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import useLoginStore from '../../store/loginStore';

const MessageButton = () => {
  const loggedUser = useLoginStore((state) => state.user);
  const position = loggedUser?.position;
  const hideMessageIcon = ['Admin', 'CEO', 'Internal'].includes(position);
  const navigate = useNavigate();

  // if (loggedUser?.role !== 'superadmin') {
  //   return null; // Don't render the button
  // }

  // if (loggedUser?.role !== 'superadmin' || hideMessageIcon) {
  //   return null;
  // }

  if (hideMessageIcon) {
    return null;
  }

  return (
    <button
      className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition"
      aria-label="Messages"
      onClick={() => navigate('/messaging')}
    >
      <FontAwesomeIcon icon={faEnvelope} size="lg" />
    </button>
  );
};

export default MessageButton;
