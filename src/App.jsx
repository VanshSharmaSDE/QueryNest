import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Documentation from './pages/Documentation';
import ApiReference from './pages/ApiReference';
import Status from './pages/Status';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Datasets from './pages/Datasets';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-gray-950 font-inter flex flex-col">
            <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />              <Route path="/documentation" element={<Documentation />} />
              <Route path="/api-reference" element={<ApiReference />} />
              <Route path="/status" element={<Status />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Dashboard Routes with DashboardLayout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:chatId?"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Chat />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/datasets"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Datasets />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#111111',
                color: '#ffffff',
                border: '1px solid #333333',
              },
            }}
          />
        </div>
      </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
