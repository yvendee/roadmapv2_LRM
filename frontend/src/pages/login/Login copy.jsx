import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/webp/momentum-logo.webp';
import useLoginStore from '../../store/loginStore'; 
import './Login.css';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const setUser = useLoginStore((state) => state.setUser);


  const handleLogin = async (e) => {
    e.preventDefault();
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      setLoginError('');
      return;
    } else {
      setEmailError('');
    }
  
    if (!password) {
      setLoginError('Password is required');
      return;
    }
  
    try {
      // ✅ 1. Get CSRF token
      const csrfRes = await fetch('/api/csrf-token', {
        credentials: 'include',
      });
      
      const { csrf_token } = await csrfRes.json();
  
      // ✅ 2. Make login request with CSRF token
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token, // Important!
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log('Login API Response:', data);
  
      if (response.ok && data.status === 'success') {
        setUser(data.user); // ✅ Store { email, role, group }
        setLoginError('');
        navigate('/home');
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Something went wrong. Please try again.');
    }
  };
  
  

  // const handleLogin = (e) => {
  //   e.preventDefault();
  
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  //   if (!emailRegex.test(email)) {
  //     setEmailError('Please enter a valid email address');
  //     return;
  //   } else {
  //     setEmailError('');
  //   }
  
  //   if (!password) {
  //     alert('Password is required');
  //     return;
  //   }
  
  //   navigate('/home');
  // };
  
  

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   // simulate successful login
  //   if (email && password) {
  //     navigate('/home');
  //   }


  //   // // Hardcoded fake login check (for demo)
  //   // if (email === 'admin@example.com' && password === 'password') {
  //   //   navigate('/home');
  //   // } else {
  //   //   alert('Invalid credentials');
  //   // }


  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="MomentumOS" className="h-10" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Log in</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(''); // Clear error on change
              }}
              required
            />
            {emailError && (
              <p className="text-red-600 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="form-checkbox text-blue-600"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
          </div>
          {/* <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-400 transition duration-200"
          >
            Log in
          </button> */}

          <button
            type="submit"
            className="login-button"
          >
            Log in
          </button>

          {loginError && (
            <p className="text-red-600 text-sm mt-2 text-center">{loginError}</p>
          )}


        </form>
      </div>
    </div>
  );
};

export default Login;
