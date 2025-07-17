import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const [crumbs, setCrumbs] = useState([]);

  useEffect(() => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    const formattedCrumbs = pathnames.map((path, index) => {
      // Convert path like 'user-profile' to 'User Profile'
      const name = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Build the URL up to this point
      const url = '/' + pathnames.slice(0, index + 1).join('/');
      
      return { name, url };
    });
    
    setCrumbs(formattedCrumbs);
  }, [location]);

  // Don't show breadcrumbs on the home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="py-4 px-4 border-b border-gray-800/40 bg-gray-900/30 backdrop-blur-sm mt-16">
      <div className="container">
        <nav className="flex items-center text-sm">
          <Link 
            to="/" 
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <Home size={16} className="mr-1" />
            <span>Home</span>
          </Link>
          
          {crumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              <ChevronRight size={16} className="mx-2 text-gray-600" />
              
              {index === crumbs.length - 1 ? (
                <span className="text-blue-400 font-medium">{crumb.name}</span>
              ) : (
                <Link 
                  to={crumb.url}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
