import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import { settingsService } from '../services';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userSettings, setUserSettings] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      // Check verification status
      if (currentUser) {
        try {
          const profile = await authService.getUserProfile(currentUser.$id);
          const verified = profile ? profile.emailVerified : false;
          setIsVerified(verified);
          
          // Load user settings if user is logged in and verified
          if (verified) {
            try {
              const settings = await settingsService.getUserSettings(currentUser.$id);
              setUserSettings(settings);
            } catch (settingsError) {
              console.error("Failed to load settings:", settingsError);
            }
          }
        } catch (profileError) {
          console.error("Failed to get user profile:", profileError);
          setIsVerified(false);
        }
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      setUser(null);
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const session = await authService.login({ email, password });
      
      if (session && session.userId) {
        const user = await authService.getCurrentUser();
        setUser(user);
        
        // Check verification (should always be true since login enforces verification)
        try {
          const profile = await authService.getUserProfile(user.$id);
          const verified = profile ? profile.emailVerified : false;
          setIsVerified(verified);
          
          // Load user settings
          if (verified) {
            try {
              const settings = await settingsService.getUserSettings(user.$id);
              setUserSettings(settings);
            } catch (settingsError) {
              console.error("Failed to load settings:", settingsError);
            }
          }
        } catch (profileError) {
          console.error("Failed to get user profile:", profileError);
        }
        
        return { success: true };
      } else {
        throw new Error('Failed to create session');
      }
    } catch (error) {
      // Throw the error instead of returning it, so Login.jsx can catch it properly
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (email, password, name) => {
    try {
      const result = await authService.sendSignupVerification(email, password, name);
      
      // Do not set user or log them in yet - they need to verify first
      return { 
        success: true, 
        userId: result.userId,
        isVerified: false,
        verificationSent: result.verificationSent,
        message: result.message
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setUserSettings(null);
      setIsVerified(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateName = async (name) => {
    try {
      const updatedUser = await authService.updateName(name);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUserSettings = async (newSettings) => {
    try {
      const settings = await settingsService.updateUserSettings(user.$id, newSettings);
      setUserSettings(settings);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const resendVerification = async (userId) => {
    try {
      await authService.resendSignupVerificationByUserId(userId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const verifyEmail = async (userId, secret) => {
    try {
      const result = await authService.verifySignupEmail(userId, secret);
      
      if (result.verified) {
        // User is now verified and logged in
        const user = await authService.getCurrentUser();
        setUser(user);
        setIsVerified(true);
        
        // Load user settings
        try {
          const settings = await settingsService.getUserSettings(user.$id);
          setUserSettings(settings);
        } catch (settingsError) {
          console.error("Failed to load settings:", settingsError);
        }
      }
      
      return { success: true, ...result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userSettings,
        loading,
        isVerified,
        checkAuth,
        login,
        register,
        logout,
        updateName,
        updateUserSettings,
        resendVerification,
        verifyEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
