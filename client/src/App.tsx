import React, { createContext, useState, useContext, useEffect } from 'react';
import { Route, Switch, useLocation, useRoute } from 'wouter';
import calmWavesBg from './assets/calm-waves.svg';
import mindfulPatternBg from './assets/mindful-pattern.svg';
import defaultProfileImg from './assets/default-profile.svg';

// === Auth Context ===
const AuthContext = createContext<any>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user', { credentials: 'include' })
      .then(res => { if (res.ok) return res.json(); throw new Error(); })
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      return true;
    }
    return false;
  };

  const signup = async (userData: { username: string; email: string; password: string; name?: string; gender: string; dateOfBirth: string; preExistingConditions: string[] }) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  // update user profile
  const updateProfile = async (updates: Partial<{ email: string; gender: string; dateOfBirth: string; preExistingConditions: string[] }>) => {
    const res = await fetch('/api/user', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      return true;
    }
    return false;
  };

  // allow updating user in context
  const updateUser = (u: any) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// === Layout Component ===
function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    // Apply theme to HTML element on initial load
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Update the HTML class for dark mode
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return <>{children}</>; // Return login/signup pages without layout when not logged in
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-blue-900 text-white'}`}>
      {/* Sidebar for Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">MindMate</h1>
          </div>
          
          <nav className="mt-8 flex-grow">
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); navigate('/'); }}
                  className={` flex items-center p-3 text-indigo-300 dark:text-white-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${location === '/' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); navigate('/profile'); }}
                  className={`flex items-center p-3 text-white dark:text-white-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${location === '/profile' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); window.open('https://9d6e4d1d7e3e17d0eb.gradio.live', '_blank'); }}
                  className="flex items-center p-3 text-white dark:text-white-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  Chatbot
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button 
              onClick={() => logout()} 
              className="w-full flex items-center p-3 text-white dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden rounded-md p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              onClick={toggleSidebar}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* User Info and Theme Toggle */}
            <div className="flex items-center">
              <button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <div className="flex items-center ml-4">
                <img 
                  className="h-8 w-8 rounded-full"
                  src={user.avatarUrl} 
                  alt={user.name} 
                />
                <span className="ml-2 text-sm font-medium">{user.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// === Protected Route Component ===
function ProtectedRoute({ children, path }: { children: React.ReactNode; path: string }) {
  const { user, loading } = useAuth();
  const [match] = useRoute(path);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (match && !loading && !user) {
      navigate('/login');
    }
  }, [user, loading, match, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!match) {
    return null;
  }

  return user ? <>{children}</> : null;
}

// === Login Page Component ===
function LoginPage() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      const success = await login({ username, password });
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } else {
      setError('Please enter both username and password.');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 auth-page-bg dark:bg-gray-900"
    >
      <div className="w-96 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Login</h2>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border-0 border-b border-gray-300 dark:border-gray-600 bg-white text-black dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0 focus:border-indigo-500 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border-0 border-b border-gray-300 dark:border-gray-600 bg-white text-black dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-white text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-800 to-purple-600 hover:from-blue-800 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
          

          <div className="text-center text-sm mt-2">
            <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); navigate('/signup'); }} 
              className="border-white text-blue-600 dark:text-blue-400 hover:text-blue-800"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

// === Signup Page Component ===
function SignupPage() {
  const { signup } = useAuth();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<{ username: string; email: string; password: string; confirmPassword: string; gender: string; dateOfBirth: string; preExistingConditions: string[] }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'Prefer not to say',
    dateOfBirth: '',
    preExistingConditions: []
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleCondition = (condition: string) => {
    setFormData(prev => {
      const conditions = [...prev.preExistingConditions];
      if (conditions.includes(condition)) {
        return {
          ...prev,
          preExistingConditions: conditions.filter(c => c !== condition)
        };
      } else {
        return {
          ...prev,
          preExistingConditions: [...conditions, condition]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.dateOfBirth) {
      setError('All fields are required.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    // Call signup
    const success = await signup(formData);
    if (success) {
      navigate('/');
    } else {
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 auth-page-bg dark:bg-gray-900"
    >
      <div className="w-96 space-y-10 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Sign up</h2>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border-0 border-b border-gray-300 dark:border-gray-600 bg-white text-black dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0 focus:border-indigo-500 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border-0 border-b border-gray-300 dark:border-gray-600 bg-white text-black dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0 focus:border-indigo-500 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border-0 border-b border-gray-300 dark:border-gray-600 bg-white text-black dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border-0 border-b border-gray-300 dark:border-gray-600 bg-white text-black dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border-0 border-b border-gray-300 dark:border-gray-600 bg-white text-black dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border-0 border-b border-gray-300 dark:border-gray-600 bg-white text-black dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-0 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="mt-4">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pre-existing Conditions</span>
              <div className="space-y-2">
                {['Anxiety', 'Depression', 'Insomnia', 'ADHD', 'PTSD'].map((condition) => (
                  <div key={condition} className="flex items-center">
                    <input
                      id={`condition-${condition}`}
                      type="checkbox"
                      checked={formData.preExistingConditions.includes(condition)}
                      onChange={() => toggleCondition(condition)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 rounded"
                    />
                    <label htmlFor={`condition-${condition}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {condition}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-white text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
          
          <div className="text-center text-sm mt-4">
            <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); navigate('/login'); }} 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

// === Dashboard Page Component ===
function DashboardPage() {
  const { user } = useAuth();
  
  const stats = [
    { id: 1, name: 'Sleep Quality', value: '72%', change: '+2%', changeType: 'increase' },
    { id: 2, name: 'Stress Level', value: 'Moderate', change: '-5%', changeType: 'decrease' },
    { id: 3, name: 'Mood Score', value: '68/100', change: '+3%', changeType: 'increase' },
    { id: 4, name: 'Physical Activity', value: '54 min', change: '+12 min', changeType: 'increase' },
  ];

  return (
    <div className="bg-gray-950">
      <h1 className="text-2xl font-semibold text-white dark:text-green-400">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back, {user?.name}! Here's your mental health overview.</p>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.id} className="dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-white dark:text-gray-400 truncate">{stat.name}</dt>
            <dd className="mt-1 text-3xl font-semibold text-white dark:text-white">{stat.value}</dd>
              <dd className={`mt-2 text-sm ${
                stat.changeType === 'increase' 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
              </dd>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-white dark:text-white">Recent Activity</h2>
          
          <div className="mt-4 space-y-4">
            <div className="border-l-4 border-indigo-500 pl-4 py-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">Completed daily mood tracking</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">Completed 20-minute meditation session</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday at 8:30 PM</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">Chatbot conversation</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday at 6:15 PM</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">Completed mental health assessment</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
            </div>
          </div>
        </div>
        
        {/* Upcoming Recommendations */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recommendations</h2>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Try a guided meditation session</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Help reduce your stress levels</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Go for a 30-minute walk</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Improve your physical activity score</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Practice deep breathing exercises</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">5 minutes before bedtime</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Schedule a chat with your therapist</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your last session was 2 weeks ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === Profile Page Component ===
function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{ email: string; gender: string; dateOfBirth: string; preExistingConditions: string[] }>({
    email: user?.email || '',
    gender: user?.gender || 'Prefer not to say',
    dateOfBirth: user?.dateOfBirth?.slice(0,10) || '',
    preExistingConditions: user?.preExistingConditions || [],
  });
  useEffect(() => {
    setFormData({
      email: user?.email || '',
      gender: user?.gender || 'Prefer not to say',
      dateOfBirth: user?.dateOfBirth?.slice(0,10) || '',
      preExistingConditions: user?.preExistingConditions || [],
    });
  }, [user]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const toggleCondition = (cond: string) => {
    setFormData(prev => {
      const list = [...prev.preExistingConditions];
      return { ...prev, preExistingConditions: list.includes(cond) ? list.filter(c => c !== cond) : [...list, cond] };
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await updateProfile(formData)) setIsEditing(false);
  };
  const calculateAge = (dob: string): number => {
    const today = new Date(); const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };
  return (
    <div className="mt-6">
      <h1 className="text-2xl font-semibold text-white dark:text-green-400">Your Profile</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your personal information and preferences</p>
      <button onClick={() => setIsEditing(!isEditing)} className="inline-flex items-center px-3 py-2 mt-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 sm:text-sm" /></div>
          <div><label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
            <input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 sm:text-sm" /></div>
          <div><label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 sm:text-sm">
              <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
            </select></div>
          <fieldset className="mt-4"><legend className="text-base font-medium text-gray-900 dark:text-gray-200">Pre-existing conditions</legend>
            <div className="mt-2 space-y-2">{['Anxiety','Depression','Insomnia','ADHD','PTSD'].map(cond => (<label key={cond} className="flex items-center"><input type="checkbox" checked={formData.preExistingConditions.includes(cond)} onChange={() => toggleCondition(cond)} className="form-checkbox h-4 w-4 text-indigo-600" /><span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{cond}</span></label>))}</div></fieldset>
          <button type="submit" className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Save
          </button>
        </form>
      ) : (
        <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="border-t border-gray-200 dark:border-gray-700"><dl>
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user?.username}</dd></div>
            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user?.email}</dd></div>
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user?.dateOfBirth ? calculateAge(user.dateOfBirth) : ''}</dd></div>
            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user?.gender || 'Prefer not to say'}</dd></div>
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"><dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pre-existing conditions</dt><dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{(user?.preExistingConditions||[]).map(cond=>(<span key={cond} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 mr-2 mb-2">{cond}</span>))}</dd></div>
          </dl></div>
        </div>
      )}
    </div>
  );
}

// === Chatbot Page Component ===
function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    depressionScore?: number;
  }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add welcome message when component mounts
    const welcomeMessage = {
      id: '1',
      content: "Hi there! I'm your mental health chatbot. How are you feeling today?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);
  
  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Math.random().toString(36).substring(2, 9),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Analyze message for depression indicators (mock)
    const mockAnalysis = analyzeSentiment(inputMessage);
    
    // Simulate bot response after delay
    setTimeout(() => {
      const botMessage = {
        id: Math.random().toString(36).substring(2, 9),
        content: mockAnalysis.response,
        isUser: false,
        timestamp: new Date(),
        depressionScore: mockAnalysis.depressionScore,
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Simple mock sentiment analysis
  function analyzeSentiment(message: string): { response: string; depressionScore: number } {
    const lowerMessage = message.toLowerCase();
    
    // Check for negative emotional words
    const negativeWords = ['sad', 'depressed', 'unhappy', 'miserable', 'anxious', 'worried', 'hopeless', 'tired', 'exhausted', 'lonely'];
    const positiveWords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'excited', 'peaceful', 'calm', 'relaxed', 'joy'];
    
    let negativeCount = 0;
    let positiveCount = 0;
    
    negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) negativeCount++;
    });
    
    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) positiveCount++;
    });
    
    let depressionScore = 0;
    let response = '';
    
    if (negativeCount > positiveCount) {
      depressionScore = Math.min(100, negativeCount * 25);
      
      if (depressionScore > 75) {
        response = "I'm really sorry to hear you're feeling this way. It sounds like you're going through a difficult time. Have you considered talking to a mental health professional about these feelings? They can provide specialized support.";
      } else if (depressionScore > 50) {
        response = "I notice you're expressing some difficult emotions. It's completely normal to have ups and downs. Would it help to talk about what might be causing these feelings?";
      } else {
        response = "Thank you for sharing how you're feeling. Sometimes just expressing our emotions can help. Is there anything specific that's troubling you today?";
      }
    } else if (positiveCount > negativeCount) {
      depressionScore = Math.max(0, 50 - (positiveCount * 15));
      response = "It's great to hear you're feeling positive! Maintaining good mental health is just as important as managing difficulties. What activities have been bringing you joy lately?";
    } else {
      depressionScore = 50;
      response = "I'm here to listen. Could you tell me more about how you're feeling and what's been on your mind lately?";
    }
    
    return { response, depressionScore };
  }
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-green-400">Mental Health Chatbot</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Talk about how you're feeling and get supportive responses</p>
      
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg flex flex-col h-[600px]">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3/4 p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p>{message.content}</p>
                  {message.depressionScore !== undefined && (
                    <div className="mt-1 text-xs opacity-75">
                      <div className="h-1 w-full bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500" 
                          style={{ width: `${message.depressionScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">Depression Indicator: {message.depressionScore}%</span>
                    </div>
                  )}
                  <span className="block text-xs mt-1 opacity-75">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-3/4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Chat Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </button>
          </form>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Note: This is a demo chatbot. In a real application, a more sophisticated AI model would be used for mental health analysis.
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
          <h2 className="font-medium text-gray-900 dark:text-white">About This Chatbot</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            This chatbot is designed to provide a safe space for you to express your feelings and thoughts. 
            It uses natural language processing to analyze your messages for potential signs of depression 
            and provides supportive responses.
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Remember that while technology can be helpful, it's not a replacement for professional mental health support. 
            If you're experiencing severe distress, please reach out to a qualified healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}

// === Not Found Page Component ===
function NotFound() {
  const [, navigate] = useLocation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white">404</h2>
        <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">Page not found</p>
        <p className="mt-6 text-base text-gray-500 dark:text-gray-400">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-10">
          <a
            href="#" 
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}

// === App Component ===
function App() {
  // Fix for hydration
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return null;
  }
  
  return (
    <AuthProvider>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/signup">
          <SignupPage />
        </Route>
        <ProtectedRoute path="/">
          <Layout>
            <DashboardPage />
          </Layout>
        </ProtectedRoute>
        <ProtectedRoute path="/profile">
          <Layout>
            <ProfilePage />
          </Layout>
        </ProtectedRoute>
        <ProtectedRoute path="/chatbot">
          <Layout>
            <ChatbotPage />
          </Layout>
        </ProtectedRoute>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </AuthProvider>
  );
}

export default App;