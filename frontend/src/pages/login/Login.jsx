import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logo from '../../assets/images/webp/momentum-logo.webp';
import useLoginStore from '../../store/loginStore'; 
import { useCompanyFilterStore } from '../../store/layout/companyFilterStore';
import { useLayoutSettingsStore } from '../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import { useCompanyTractionUserStore } from '../../store/layout/companyTractionUserStore';
import useCompanyTractionStore from '../../store/left-lower-content/6.company-traction/2.companyTractionStore';
import useMembersDepartmentsStore from '../../store/left-lower-content/16.members-directory/1.membersDirectoryStore';
import API_URL from '../../configs/config';
import { ENABLE_CONSOLE_LOGS} from '../../configs/config';
import './Login.css';

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const setUser = useLoginStore((state) => state.setUser);
//   const setSessionId = useLoginStore((state) => state.setSessionId);
//   const { user } = useLoginStore((state) => state); // Get logged-in user from store


//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [emailError, setEmailError] = useState('');
//   const [loginError, setLoginError] = useState(location.state?.loginError || '');
//   const [isLoading, setIsLoading] = useState(false);

//   let firstCompany = null

//   // ✅ Load saved credentials on mount
//   useEffect(() => {
//     const savedEmail = localStorage.getItem('rememberedEmail');
//     const savedPassword = localStorage.getItem('rememberedPassword');
//     if (savedEmail && savedPassword) {
//       setEmail(savedEmail);
//       setPassword(savedPassword);
//       setRememberMe(true);
//     }
//   }, []);

//   useEffect(() => {
//     const hasReloaded = sessionStorage.getItem('hasReloaded');
  
//     if (!hasReloaded) {
//       sessionStorage.setItem('hasReloaded', 'true');
//       window.location.reload();
//     }
//   }, []);
  


//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setEmailError('Please enter a valid email address');
//       setLoginError('');
//       return;
//     } else {
//       setEmailError('');
//     }

//     if (!password) {
//       setLoginError('Password is required');
//       return;
//     }

//     setIsLoading(true);

//     setTimeout(async () => {
//       try {
//         const csrfRes = await fetch(`${API_URL}/csrf-token`, {
//           credentials: 'include',
//         });
//         const { csrf_token } = await csrfRes.json();

//         const response = await fetch(`${API_URL}/login`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-CSRF-TOKEN': csrf_token,
//           },
//           credentials: 'include',
//           body: JSON.stringify({ email, password }),
//         });

//         const data = await response.json();
//         ENABLE_CONSOLE_LOGS && console.log('Login API Response:', data);

//         if (response.ok && data.status === 'success') {
//           setUser(data.user);
//           setSessionId(data.session_id);
//           setLoginError('');

//           // ✅ Save or clear localStorage based on checkbox
//           if (rememberMe) {
//             localStorage.setItem('rememberedEmail', email);
//             localStorage.setItem('rememberedPassword', password);
//           } else {
//             localStorage.removeItem('rememberedEmail');
//             localStorage.removeItem('rememberedPassword');
//           }


//           // let firstCompany = null; 
          
//           try {

//             // ✅ Step 1: Fetch Company Options
//             const companyRes = await fetch(`${API_URL}/v1/company-options`, {
//               credentials: 'include',
//               headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//               },
//             });
          
//             if (!companyRes.ok) throw new Error('Company fetch failed');
          
//             const companies = await companyRes.json();

//             ENABLE_CONSOLE_LOGS &&  console.log('Fetched Company List: ',companies);

//             // firstCompany = companies[0];
//              // Check if user is not a superadmin, use user?.organization if true
//             firstCompany = user?.role !== 'superadmin' ? user?.organization : companies[0];

//             // ✅ Update store
//             useCompanyFilterStore.setState({ options: companies, selected: firstCompany });
          
          
//             // ✅ Step 2: Fetch Layout Toggles for selected company
//             const toggleRes = await fetch(`${API_URL}/v1/get-layout-toggles?organization=${encodeURIComponent(firstCompany)}`);
//             const toggleJson = await toggleRes.json();
          
//             if (toggleJson.status === 'success') {
//               useLayoutSettingsStore.setState({
//                 toggles: toggleJson.toggles,
//                 organization: toggleJson.organization,
//                 unique_id: toggleJson.unique_id,
//               });
//               ENABLE_CONSOLE_LOGS &&  console.log('Fetched toggles', ' for ', firstCompany, ':', toggleJson.toggles);
//             } else {
//               console.error('Toggle fetch error:', toggleJson.message);
//             }
          
//           } catch (error) {
//             console.error('Post-login fetch error:', error);
//           }

//           // ✅ Step 3: Fetch Company Traction Users using the selected organization
//           try {
//             const tractionUserRes = await fetch(
//               `${API_URL}/v1/company-traction-users?organizationName=${encodeURIComponent(firstCompany)}`,
//               {
//                 credentials: 'include',
//                 headers: {
//                   'Accept': 'application/json',
//                   'Content-Type': 'application/json',
//                 },
//               }
//             );

//             if (!tractionUserRes.ok) throw new Error('Traction users fetch failed');

//             const tractionUsers = await tractionUserRes.json();

//             ENABLE_CONSOLE_LOGS && console.log('Fetched Traction Users:', tractionUsers);

//             const firstUser = tractionUsers[0] || null;

//             // ✅ Update Zustand store
//             useCompanyTractionUserStore.setState({
//               users: tractionUsers,
//               selectedUser: firstUser,
//             });
//           } catch (error) {
//             console.error('Error fetching traction users:', error);
//           }
          

//           navigate('/home');
          
//         } else {
//           setLoginError(data.message || 'Login failed');
//         }
//       } catch (error) {
//         console.error('Login error:', error);
//         setLoginError('Something went wrong. Please try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     }, 100);
//   };

//   // ✅ Handle uncheck logic immediately
//   const handleRememberToggle = () => {
//     const newValue = !rememberMe;
//     setRememberMe(newValue);
  
//     if (!newValue) {
//       localStorage.removeItem('rememberedEmail');
//       localStorage.removeItem('rememberedPassword');
//       setPassword(''); // ✅ Clear password input
//     }
//   };
  

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       {/* <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"> */}
//       {/* <div className="bg-white p-8 w-full max-w-md"> */}
//       <div className="bg-white shadow-lg w-full max-w-md mx-auto flex flex-col justify-center p-10">
//         <div className="flex justify-center mb-6">
//           <img src={logo} alt="MomentumOS" className="h-10" />
//         </div>
//         <h2 className="text-2xl font-semibold text-center mb-6">Log in</h2>
//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="block text-gray-600 mb-1" htmlFor="email">Email address</label>
//             <input
//               type="email"
//               id="email"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 setEmailError('');
//               }}
//               required
//             />
//             {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
//           </div>

//           <div>
//             <label className="block text-gray-600 mb-1" htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <div className="flex items-center justify-between">
//             <label className="flex items-center space-x-2 text-sm text-gray-600">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={handleRememberToggle}
//                 className="form-checkbox text-blue-600"
//               />
//               <span>Remember me</span>
//             </label>
//             <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
//               Forgot Password?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             className="login-button flex items-center justify-center"
//             disabled={isLoading}
//           >
//             {isLoading ? <span className="spinner"></span> : 'Log in'}
//           </button>

//           {loginError && (
//             <p className="text-red-600 text-sm mt-2 text-center">{loginError}</p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useLoginStore((state) => state.setUser);
  const setSessionId = useLoginStore((state) => state.setSessionId);
  const { user } = useLoginStore((state) => state); // Get logged-in user from store


  const setCompanyTraction = useCompanyTractionStore((state) => state.setCompanyTraction);
  const setBaselineCompanyTraction = useCompanyTractionStore((state) => state.setBaselineCompanyTraction);


  const setMembersDepartments = useMembersDepartmentsStore((state) => state.setMembersDepartments);
  const setBaselineMembersDirectoryTable = useMembersDepartmentsStore((state) => state.setBaselineMembersDirectoryTable)


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState(location.state?.loginError || '');
  const [isLoading, setIsLoading] = useState(false);

  let firstCompany = null;

  // ✅ Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem('hasReloaded');
  
    if (!hasReloaded) {
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }
  }, []);

 
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
  
    setIsLoading(true);
  
    setTimeout(async () => {
      try {
        const csrfRes = await fetch(`${API_URL}/csrf-token`, {
          credentials: 'include',
        });
        const { csrf_token } = await csrfRes.json();
  
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token,
          },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
        ENABLE_CONSOLE_LOGS && console.log('Login API Response:', data);
  
        if (response.ok && data.status === 'success') {
          setUser(data.user); // Set user state
          setSessionId(data.session_id);
          setLoginError('');
  
          // ✅ Save or clear localStorage based on checkbox
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
          } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
          }
  
          let companies = [];
  
          try {
            // Fetching companies
            const companyRes = await fetch(`${API_URL}/v1/company-options`, {
              credentials: 'include',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            });
  
            if (!companyRes.ok) throw new Error('Company fetch failed');
            companies = await companyRes.json();
  
            ENABLE_CONSOLE_LOGS && console.log('Fetched Company List: ', companies);
  
          } catch (error) {
            console.error('Company fetch error:', error);
            setLoginError('Failed to fetch company options');
            return; // Stop if there’s an error
          }
  
          if (companies.length === 0) {
            throw new Error('No companies available');
          }
  
          const user = useLoginStore.getState().user; // Accessing the user directly from Zustand
  
          firstCompany = user?.role !== 'superadmin' && user?.organization ? user?.organization : companies[0];
  
          if (!firstCompany) {
            throw new Error('First company is not valid');
          }
  
          useCompanyFilterStore.setState({ options: companies, selected: firstCompany });
  
          // Fetching layout toggles for the selected company
          setTimeout(async () => {
            const toggleRes = await fetch(
              `${API_URL}/v1/get-layout-toggles?organization=${encodeURIComponent(firstCompany)}`
            );
            const toggleJson = await toggleRes.json();
  
            if (toggleJson.status === 'success') {
              useLayoutSettingsStore.setState({
                toggles: toggleJson.toggles,
                organization: toggleJson.organization,
                unique_id: toggleJson.unique_id,
              });
              ENABLE_CONSOLE_LOGS && console.log('Fetched toggles for', firstCompany, ':', toggleJson.toggles);
            } else {
              console.error('Toggle fetch error:', toggleJson.message);
            }
          }, 500); // Delay before fetching layout toggles


          // ✅ Step 3: Fetch Company Traction Users using the selected organization
          try {
            const tractionUserRes = await fetch(
              `${API_URL}/v1/company-traction-users?organizationName=${encodeURIComponent(firstCompany)}`,
              {
                credentials: 'include',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
              }
            );

            if (!tractionUserRes.ok) throw new Error('Traction users fetch failed');

            const tractionUsers = await tractionUserRes.json();

            ENABLE_CONSOLE_LOGS && console.log('Fetched Traction Users:', tractionUsers);

            const firstUser = tractionUsers[0] || null;

            // ✅ Update Zustand store
            useCompanyTractionUserStore.setState({
              users: tractionUsers,
              selectedUser: firstUser,
            });
          } catch (error) {
            console.error('Error fetching traction users:', error);
          }

          // Step 4:
          // ✅ Fetch Company Traction Table (Async Template Method)
          try {
            const encodedOrg = encodeURIComponent(firstCompany);

            const res = await fetch(
              `${API_URL}/v1/company-traction/traction-data?organization=${encodedOrg}`,
              {
                method: 'GET',
                credentials: 'include',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              }
            );

            const json = await res.json();

            if (!res.ok) {
              if (res.status === 401) {
                navigate('/', { state: { loginError: 'Session Expired' } });
              } else {
                console.error('Fetch error:', json.message);
              }
              return;
            }

            ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Company Traction Table:', json);

            setCompanyTraction(json);
            setBaselineCompanyTraction(json);
          } catch (error) {
            console.error('API error:', error);
          }

          // Step 5:
          // ✅ Fetch Members Directory (Async Template Method)
          try {
            const encodedOrg = encodeURIComponent(firstCompany);

            const res = await fetch(
              `${API_URL}/v1/members-directory?organization=${encodedOrg}`,
              {
                method: 'GET',
                credentials: 'include',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              }
            );

            const json = await res.json();

            if (!res.ok) {
              if (res.status === 401) {
                navigate('/', { state: { loginError: 'Session Expired' } });
              } else {
                console.error('Error:', json.message);
              }
              return;
            }

            if (Array.isArray(json)) {
              setMembersDepartments(json);
              setBaselineMembersDirectoryTable(json);
              ENABLE_CONSOLE_LOGS && console.log('📥 Fetched Members Directory:', json);
            } else {
              console.error(`⚠️ No Members Directory found for organization: ${organization}`);
            }
          } catch (error) {
            console.error('API error:', error);
          }





  
          // **Redirect to Home Page after successful login**
          navigate('/home'); // Navigate to home after a successful login
  
        } else {
          setLoginError(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoginError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };
  
  
  
  // Add a useEffect to monitor the user data after login and set up conditional fetching
  useEffect(() => {
    const user = useLoginStore.getState().user;
  
    if (user?.role && user?.organization) {
      console.log('User Role:', user.role);
      console.log('User Organization:', user.organization);
    } else {
      console.error('User data not found or incomplete');
    }
  }, [useLoginStore.getState().user]); // Re-run effect if the user changes
  
  

  // ✅ Handle uncheck logic immediately
  const handleRememberToggle = () => {
    const newValue = !rememberMe;
    setRememberMe(newValue);
  
    if (!newValue) {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
      setPassword(''); // ✅ Clear password input
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg w-full max-w-md mx-auto flex flex-col justify-center p-10">
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
                setEmailError('');
              }}
              required
            />
            {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
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
                onChange={handleRememberToggle}
                className="form-checkbox text-blue-600"
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="login-button flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner"></span> : 'Log in'}
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
