import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, MessageSquare, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  const handleLogout = async () => {
    await logout();
    closeMenu();
  };

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled || user ? 'bg-gray-900/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-sm">QN</span>
              </div>
              {user && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>
            <span className="text-xl font-bold text-white">QueryNest</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <div className="pl-4 ml-2 border-l border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="pl-4 ml-2 border-l border-gray-700 flex items-center space-x-3">
                <Link to="/login" className="btn btn-secondary">
                  <span>Sign In</span>
                </Link>
                <Link to="/register" className="btn btn-primary">
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg bg-gray-800/70 text-gray-300 hover:text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 invisible'} overflow-hidden bg-gray-900/95 backdrop-blur-lg`}>
        <div className="container mx-auto px-4 py-4 space-y-4">
          <Link to="/" className="mobile-nav-link">Home</Link>
          <Link to="/about" className="mobile-nav-link">About</Link>
          <Link to="/contact" className="mobile-nav-link">Contact</Link>
          
          {user ? (
            <>
              <div className="pt-4 border-t border-gray-800">
                <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <User size={18} className="text-blue-400" />
                    <span className="text-sm text-gray-300 font-medium truncate">
                      {user.name || user.email}
                    </span>
                  </div>
                </div>
                
                <Link to="/dashboard" className="mobile-nav-link flex items-center">
                  <Database size={18} className="mr-2" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/chat" className="mobile-nav-link flex items-center">
                  <MessageSquare size={18} className="mr-2" />
                  <span>New Chat</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 btn btn-secondary flex items-center justify-center"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-gray-800 grid gap-3">
              <Link to="/login" className="btn btn-secondary w-full">
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="btn btn-primary w-full">
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
