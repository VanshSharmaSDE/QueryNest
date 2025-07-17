import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { settingsService } from '../services/settingsService';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    chat_history_enabled: true,
    notifications_enabled: true,
    theme: 'dark',
    default_model: 'gpt-3.5-turbo',
    temperature: 0.7,
    max_tokens: 1000,
    loading: true
  });

  useEffect(() => {
    if (user) {
      loadUserSettings();
    } else {
      setSettings(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;
    
    try {
      setSettings(prev => ({ ...prev, loading: true }));
      const userSettings = await settingsService.getUserSettings(user.$id);
      
      if (userSettings) {
        setSettings({
          chat_history_enabled: userSettings.chat_history_enabled ?? true,
          notifications_enabled: userSettings.notifications_enabled ?? true,
          theme: userSettings.theme || 'dark',
          default_model: userSettings.default_model || 'gpt-3.5-turbo',
          temperature: userSettings.temperature || 0.7,
          max_tokens: userSettings.max_tokens || 1000,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      setSettings(prev => ({ ...prev, loading: false }));
    }
  };

  const updateSetting = async (key, value) => {
    if (!user) return;

    try {
      // Update local state immediately
      setSettings(prev => ({ ...prev, [key]: value }));

      // Update in database
      const updatePayload = { [key]: value };
      await settingsService.updateModelSettings(user.$id, updatePayload);
    } catch (error) {
      console.error('Error updating setting:', error);
      // Revert on error
      setSettings(prev => ({ ...prev, [key]: !value }));
      throw error;
    }
  };

  const value = {
    settings,
    updateSetting,
    loadUserSettings,
    isChatHistoryEnabled: settings.chat_history_enabled,
    isLoading: settings.loading
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
