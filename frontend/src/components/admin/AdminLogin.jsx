import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      
      if (res.data.role !== 'Admin') {
        setErrorMsg('Access Denied: You do not have Admin privileges.');
        return;
      }

      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMsg(err.response.data.error); // Specific deterministic error from Backend
      } else {
        setErrorMsg('Network error. Please ensure backend is running.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
        </div>
        
        {errorMsg && (
          <div data-testid="login-error-msg" className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
            {errorMsg}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin} data-testid="admin-login-form">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label className="sr-only">Username or email</label>
              <input name="email" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Username or email" value={email} onChange={e => setEmail(e.target.value)} data-testid="login-input-email" />
            </div>
            <div>
              <label className="sr-only">Password</label>
              <input name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} data-testid="login-input-password" />
            </div>
          </div>

          <div>
            <button type="submit" disabled={isLoading} data-testid="login-submit-btn" className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isLoading ? <span data-testid="loading-spinner">Authenticating...</span> : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
