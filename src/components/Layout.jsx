import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  
  // Check if the current route is part of the app area (no navbar/footer)
  const isAppArea = path.includes('/dashboard') || 
                    path.includes('/chat') || 
                    path.includes('/datasets') || 
                    path.includes('/settings');
  
  return (
    <>
      {!isAppArea && <Navbar />}
      {!isAppArea && <Breadcrumb />}
      <main className={`flex-grow ${!isAppArea ? '' : ''}`}>
        {children}
      </main>
      {!isAppArea && <Footer />}
    </>
  );
};

export default Layout;
