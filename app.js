import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// === Auth Context ===
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate initial auth check
  useEffect(() => {
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (credentials) => {
    // For demo, we'll just check if username and password are provided
    if (credentials.username && credentials.password) {
      const userData = {
        id: 1,
        username: credentials.username,
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: 'https://via.placeholder.com/150',
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const signup = (userData) => {
    if (userData.username && userData.password && userData.email) {
      const newUser = {
        id: 1,
        username: userData.username,
        name: userData.name || userData.username,
        email: userData.email,
        avatarUrl: 'https://via.placeholder.com/150',
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
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
function Layout({ children }) {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would also update the HTML class or a CSS variable
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return children; // Return login/signup pages without layout when not logged in
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar for Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">MindMate</h1>
          </div>
          
          <nav className="mt-8 flex-grow">
            <ul className="space-y-2">
              <li>
                <a href="#dashboard" className="flex items-center p-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#profile" className="flex items-center p-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Profile
                </a>
              </li>
              <li>
                <a href="#quiz" className="flex items-center p-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Mental Health Quiz
                </a>
              </li>
              <li>
                <a href="#chatbot" className="flex items-center p-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
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
              onClick={logout} 
              className="w-full flex items-center p-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
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
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return user ? children : null;
}

// === Login Page Component ===
function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      const success = login({ username, password });
      if (success) {
        router.push('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } else {
      setError('Please enter both username and password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <a href="#" onClick={() => router.push('/signup')} className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              create a new account
            </a>
          </p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// === Signup Page Component ===
function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    // Call signup
    const success = signup(formData);
    if (success) {
      router.push('/');
    } else {
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Create a new account</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <a href="#" onClick={() => router.push('/login')} className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              sign in to existing account
            </a>
          </p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Account
            </button>
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
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back, {user?.name}! Here's your mental health overview.</p>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</dd>
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
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
          
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
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: '25',
    gender: 'Prefer not to say',
    conditions: []
  });
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const toggleCondition = (condition) => {
    setFormData(prev => {
      const conditions = [...prev.conditions];
      if (conditions.includes(condition)) {
        return {
          ...prev,
          conditions: conditions.filter(c => c !== condition)
        };
      } else {
        return {
          ...prev,
          conditions: [...conditions, condition]
        };
      }
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Save profile data (this would update the backend in a real app)
    setIsEditing(false);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Profile</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your personal information and preferences</p>
      
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Personal Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Your personal details and medical history</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {isEditing ? (
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Age
                    </label>
                    <input
                      type="text"
                      name="age"
                      id="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Non-binary</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <fieldset>
                    <legend className="text-base font-medium text-gray-900 dark:text-white">Pre-existing conditions</legend>
                    <div className="mt-4 space-y-4">
                      {['Anxiety', 'Depression', 'Insomnia', 'ADHD', 'PTSD'].map((condition) => (
                        <div key={condition} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={condition}
                              name="conditions"
                              type="checkbox"
                              checked={formData.conditions.includes(condition)}
                              onChange={() => toggleCondition(condition)}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-700 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={condition} className="font-medium text-gray-700 dark:text-gray-300">
                              {condition}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="border-t border-gray-200 dark:border-gray-700">
              <dl>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user?.name}</dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user?.email}</dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">25</dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">Prefer not to say</dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pre-existing conditions</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 mr-2 mb-2">
                      Anxiety
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 mr-2 mb-2">
                      Depression
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Device Connections</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Connected devices and data sources</p>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Apple Watch</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Connected - Last synced 2 hours ago</p>
                  </div>
                </div>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Disconnect</button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Fitbit</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Not connected</p>
                  </div>
                </div>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Connect</button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Google Fit</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Not connected</p>
                  </div>
                </div>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Connect</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === Quiz Page Component ===
function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  
  const questions = [
    {
      id: 'q1',
      text: 'Over the past two weeks, how often have you had little interest or pleasure in doing things?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'q2',
      text: 'Over the past two weeks, how often have you felt down, depressed, or hopeless?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'q3',
      text: 'Over the past two weeks, how often have you had trouble falling asleep, staying asleep, or sleeping too much?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'q4',
      text: 'Over the past two weeks, how often have you felt tired or had little energy?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'q5',
      text: 'Over the past two weeks, how often have you had poor appetite or been overeating?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'q6',
      text: 'Over the past two weeks, how often have you felt bad about yourself or that you are a failure or have let yourself or your family down?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'q7',
      text: 'Over the past two weeks, how often have you had trouble concentrating on things, such as reading the newspaper or watching television?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'q8',
      text: 'Over the past two weeks, how often have you been feeling anxious, nervous, or on edge?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
    {
      id: 'q9',
      text: 'Over the past two weeks, how often have you been unable to stop or control worrying?',
      options: [
        { value: 0, label: 'Not at all' },
        { value: 1, label: 'Several days' },
        { value: 2, label: 'More than half the days' },
        { value: 3, label: 'Nearly every day' },
      ],
    },
  ];
  
  const handleAnswer = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };
  
  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult();
    }
  };
  
  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const calculateResult = () => {
    // Simple scoring algorithm
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    const maxScore = questions.length * 3;
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    let depressionLevel;
    if (percentage < 25) {
      depressionLevel = 'Minimal or no depression';
    } else if (percentage < 50) {
      depressionLevel = 'Mild depression';
    } else if (percentage < 75) {
      depressionLevel = 'Moderate depression';
    } else {
      depressionLevel = 'Severe depression';
    }
    
    setResult({
      score: totalScore,
      maxScore,
      percentage,
      level: depressionLevel,
      recommendations: [
        'Consider regular physical exercise',
        'Maintain a consistent sleep schedule',
        'Practice mindfulness meditation',
        'Connect with friends and family',
      ],
    });
  };
  
  const restartQuiz = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Mental Health Assessment</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This quiz helps assess symptoms of depression and anxiety</p>
      
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        {!result ? (
          <>
            <div className="mb-6">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 dark:text-indigo-400 bg-indigo-200 dark:bg-indigo-900">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-indigo-600 dark:text-indigo-400">
                      {Math.round(((step + 1) / questions.length) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200 dark:bg-indigo-900">
                  <div
                    style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                  ></div>
                </div>
              </div>
            </div>
          
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">{questions[step].text}</h2>
              
              <div className="space-y-3">
                {questions[step].options.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      id={`option-${option.value}`}
                      name={`question-${questions[step].id}`}
                      type="radio"
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      checked={answers[questions[step].id] === option.value}
                      onChange={() => handleAnswer(questions[step].id, option.value)}
                    />
                    <label htmlFor={`option-${option.value}`} className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handlePrev}
                disabled={step === 0}
                className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  step === 0
                    ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-700 cursor-not-allowed'
                    : 'text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                disabled={answers[questions[step].id] === undefined}
                className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  answers[questions[step].id] === undefined
                    ? 'text-gray-400 bg-gray-100 dark:text-gray-500 dark:bg-gray-700 cursor-not-allowed'
                    : 'text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {step === questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your Assessment Results</h2>
            
            <div className="mb-8">
              <div className="inline-flex items-center justify-center p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                <span className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">{result.score}/{result.maxScore}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Total Score</p>
            </div>
            
            <div className="mb-8">
              <div className="inline-block bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{result.level}</h3>
                <p className="text-gray-600 dark:text-gray-300">Based on your responses, you show signs of {result.level.toLowerCase()}.</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Please note that this is not a clinical diagnosis. If you're concerned about your mental health, 
                  please consult with a qualified healthcare professional.
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recommendations</h3>
              <ul className="space-y-2 text-left max-w-md mx-auto">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button
              onClick={restartQuiz}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Take Quiz Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// === Chatbot Page Component ===
function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef(null);
  
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
  
  const handleSendMessage = (e) => {
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
  function analyzeSentiment(message) {
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
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Mental Health Chatbot</h1>
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
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
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

// === Routes Component ===
function Routes() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState('dashboard');
  
  // Simulate routing
  useEffect(() => {
    if (router.pathname === '/login') {
      setPage('login');
    } else if (router.pathname === '/signup') {
      setPage('signup');
    } else if (user) {
      // Extract page from hash if present
      const hashPage = window.location.hash.substring(1);
      if (['dashboard', 'profile', 'quiz', 'chatbot'].includes(hashPage)) {
        setPage(hashPage);
      } else {
        setPage('dashboard');
      }
    }
  }, [router.pathname, user]);
  
  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hashPage = window.location.hash.substring(1);
      if (['dashboard', 'profile', 'quiz', 'chatbot'].includes(hashPage)) {
        setPage(hashPage);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Auth pages
  if (!user) {
    if (page === 'login') {
      return <LoginPage />;
    }
    if (page === 'signup') {
      return <SignupPage />;
    }
    // Redirect to login if not authenticated
    return <LoginPage />;
  }
  
  // Main app pages (protected)
  return (
    <Layout>
      {page === 'dashboard' && <DashboardPage />}
      {page === 'profile' && <ProfilePage />}
      {page === 'quiz' && <QuizPage />}
      {page === 'chatbot' && <ChatbotPage />}
    </Layout>
  );
}

// === Main App Component ===
function App() {
  // Fix for Next.js hydration
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return null;
  }
  
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;