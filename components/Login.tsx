
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (token: string) => void;
  apiBaseUrl: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, apiBaseUrl }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // FastAPI's OAuth2PasswordRequestForm expects form data, not JSON.
    const details = {
        'username': email,
        'password': password
    };
    const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');


    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Login failed. Please check your credentials.' }));
        throw new Error(errorData.detail || 'An unknown error occurred.');
      }

      const data = await response.json();
      onLogin(data.access_token);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-lg">
        <div className="flex flex-col items-center text-center">
            <svg className="w-16 h-16 text-bunyodkor-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 00-9.4 13.57l5.9 5.9a10 10 0 0013.57 0l5.9-5.9A10 10 0 0012 2zm-1.06 9.54L9 13.5l1.06 1.06L12 12.5l1.94 1.94L15 13.5l-1.94-1.94L15 9.5l-1.06-1.06L12 10.5l-1.94-1.94L9 9.5l1.94 1.94z" />
            </svg>
            <h1 className="text-3xl font-bold text-bunyodkor-blue mt-2">Bunyodkor Academy</h1>
            <p className="text-text-secondary">CRM Portal Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bunyodkor-blue bg-white text-gray-900 placeholder-gray-400"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bunyodkor-blue bg-white text-gray-900"
              placeholder="••••••••"
            />
          </div>
          
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-bunyodkor-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
