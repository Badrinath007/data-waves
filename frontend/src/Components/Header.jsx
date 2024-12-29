import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(false);

  // Check for the current session and listen for auth state changes
  useEffect(() => {    
    // Get the current session asynchronously
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user != undefined);
    };
    
    getSession();

    // Listen for auth state changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user != undefined);
    });

    // Cleanup the subscription on component unmount
    return () => {
      subscription?.unsubscribe();  // Unsubscribe correctly
    };
  }, []);

  // Logout handler
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) { 
      setUser(false);
      navigate('/');
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
      {/* Logo and App Name */}
      <div className="flex items-center space-x-2">
        <img
          src="/src/assets/1715.jpeg" // Replace with your actual logo path
          alt="App Logo"
          className="w-8 h-8 rounded-full"
        />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Waves</h1>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/')}
          className="px-2 py-2 dark:text-white rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
        >
          Home
        </button>
        <h1>{user}</h1>
        {user ? (
          <>
          <button
          onClick={() => navigate('/dashboard')}
          className="px-2 py-2 dark:text-white rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
          >
            DashBoard
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="px-2 py-2 dark:text-white rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-2 py-2 dark:text-white rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-2 py-2 dark:text-white rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-2 py-2 dark:text-white rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
            >
              Signup
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
