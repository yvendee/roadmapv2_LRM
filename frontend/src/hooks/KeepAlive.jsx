import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API_URL from '../configs/config';

const useSessionKeepAlive = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't start the interval if the user is on the login page ("/")
    if (location.pathname === '/') return;

    const interval = setInterval(() => {
      fetch(`${API_URL}/keep-alive`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      })
        .then(res => {
          if (res.status === 401) {
            console.warn('Session expired. Redirecting to login.');
            navigate('/', {
              state: { loginError: 'Session ended because of inactivity.' },
            });
          }
          return res.json();
        })
        .then(data => {
          console.log('[Session Check] ✅', data.message);
        })
        .catch(err => {
          console.error('[Session Check] Error:', err);
        });
    }, 2 * 60 * 1000); // every 2 minutes

    return () => clearInterval(interval);
  }, [navigate, location.pathname]); // Watch for route changes
};

export default useSessionKeepAlive;
