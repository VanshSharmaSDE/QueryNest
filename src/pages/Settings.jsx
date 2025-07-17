import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import authService from "../services/authService";
import { settingsService } from "../services/settingsService";
import {
  User,
  Moon,
  Sun,
  Save,
  RefreshCw,
  Shield,
  Bell,
  Palette,
  Globe,
  Edit,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Settings = () => {
  const { user, logout } = useAuth();
  const {
    settings: globalSettings,
    updateSetting,
    loadUserSettings: reloadGlobalSettings,
    isLoading: settingsLoading,
  } = useSettings();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [checkboxLoading, setCheckboxLoading] = useState({});
  const [themeLoading, setThemeLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [settings, setSettings] = useState({
    defaultModel: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 1000,
    emailNotifications: true,
    saveHistory: true,
    theme: "dark",
  });

  useEffect(() => {
    if (user && globalSettings && !settingsLoading) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));

      // Sync with global settings
      setSettings({
        defaultModel: globalSettings.default_model || "gpt-3.5-turbo",
        temperature: globalSettings.temperature || 0.7,
        maxTokens: globalSettings.max_tokens || 1000,
        emailNotifications: globalSettings.notifications_enabled ?? true,
        saveHistory: globalSettings.chat_history_enabled ?? true,
        theme: globalSettings.theme || "dark",
      });
      setDarkMode(globalSettings.theme !== "light");
      setInitialLoading(false);
    }
  }, [user, globalSettings, settingsLoading]);

  // Initialize dark mode state when settings load
  useEffect(() => {
    setDarkMode(settings.theme !== "light");
  }, [settings.theme]);

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    if (!profileData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      const updates = {
        name: profileData.name,
      };

      // Only include email if it's different from current
      if (profileData.email !== user.email) {
        if (!profileData.currentPassword) {
          toast.error("Current password is required to change email");
          setLoading(false);
          return;
        }
        updates.email = profileData.email;
        updates.password = profileData.currentPassword;
      }

      await authService.updateProfile(user.$id, updates);
      toast.success("Profile updated successfully!");
      setShowProfileEdit(false);
      setProfileData((prev) => ({ ...prev, currentPassword: "" }));

      // Refresh the page to get updated user data
      window.location.reload();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      !profileData.currentPassword ||
      !profileData.newPassword ||
      !profileData.confirmPassword
    ) {
      toast.error("All password fields are required");
      return;
    }

    if (profileData.newPassword !== profileData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (profileData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      await authService.updateProfile(user.$id, {
        newPassword: profileData.newPassword,
        currentPassword: profileData.currentPassword,
      });

      toast.success("Password changed successfully!");
      setShowPasswordChange(false);
      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Password change error:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = async (e) => {
    const { name, checked } = e.target;

    // Set loading state for this specific checkbox
    setCheckboxLoading((prev) => ({ ...prev, [name]: true }));

    // Update local state immediately
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));

    try {
      // Use the global settings context to update
      await updateSetting(
        name === "emailNotifications"
          ? "notifications_enabled"
          : "chat_history_enabled",
        checked
      );

      toast.success(
        `${
          name === "emailNotifications" ? "Email notifications" : "Chat history"
        } ${checked ? "enabled" : "disabled"}`
      );
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Failed to update setting");
      // Revert on error
      setSettings((prev) => ({
        ...prev,
        [name]: !checked,
      }));
    } finally {
      setCheckboxLoading((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const updatedSettings = {
        default_model: settings.defaultModel,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
        notifications_enabled: settings.emailNotifications,
        chat_history_enabled: settings.saveHistory,
        theme: settings.theme,
      };

      await settingsService.updateModelSettings(user.$id, updatedSettings);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = darkMode ? "light" : "dark";
    setThemeLoading(true);
    setDarkMode(!darkMode);
    setSettings((prev) => ({ ...prev, theme: newTheme }));

    try {
      await updateSetting("theme", newTheme);
      toast.success(`${newTheme === "dark" ? "Dark" : "Light"} mode activated`);
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error("Failed to update theme");
      // Revert on error
      setDarkMode(darkMode);
      setSettings((prev) => ({ ...prev, theme: darkMode ? "dark" : "light" }));
    } finally {
      setThemeLoading(false);
    }
  };

  const resetSettings = async () => {
    setResetLoading(true);
    const defaultSettings = {
      defaultModel: "gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 1000,
      emailNotifications: true,
      saveHistory: true,
      theme: "dark",
    };

    setSettings(defaultSettings);
    setDarkMode(true);

    try {
      const updatedSettings = {
        default_model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 1000,
        notifications_enabled: true,
        chat_history_enabled: true,
        theme: "dark",
      };

      await settingsService.updateModelSettings(user.$id, updatedSettings);
      toast.success("Settings reset to defaults");
    } catch (error) {
      console.error("Error resetting settings:", error);
      toast.error("Failed to reset settings");
    } finally {
      setResetLoading(false);
    }
  };

  if (initialLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">
          Customize your AI assistant and application preferences
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - User & Display */}
        <div className="md:col-span-1 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-xl font-semibold">Profile</h2>
              <button
                onClick={() => setShowProfileEdit(!showProfileEdit)}
                className="btn btn-secondary btn-sm"
              >
                <Edit size={16} />
                Edit
              </button>
            </div>

            {showProfileEdit ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileInputChange}
                    className="input w-full"
                    placeholder="Your name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileInputChange}
                    className="input w-full"
                    placeholder="Your email"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Changing email requires current password
                  </p>
                </div>

                {profileData.email !== user?.email && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={profileData.currentPassword}
                      onChange={handleProfileInputChange}
                      className="input w-full"
                      placeholder="Enter current password"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    {loading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <>
                        <Save size={16} />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileEdit(false);
                      setProfileData((prev) => ({
                        ...prev,
                        name: user?.name || "",
                        email: user?.email || "",
                        currentPassword: "",
                      }));
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                  <User size={32} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-lg">{user?.name}</p>
                  <p className="text-gray-400">{user?.email}</p>
                </div>
              </div>
            )}

            <div className="border-t border-gray-800 pt-4">
              <h3 className="font-medium mb-3">Security</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="btn btn-secondary btn-sm w-full"
                >
                  <Lock size={16} />
                  Change Password
                </button>

                {showPasswordChange && (
                  <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={profileData.currentPassword}
                        onChange={handleProfileInputChange}
                        className="input w-full"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={profileData.newPassword}
                        onChange={handleProfileInputChange}
                        className="input w-full"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={profileData.confirmPassword}
                        onChange={handleProfileInputChange}
                        className="input w-full"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="btn btn-primary btn-sm flex-1"
                      >
                        {loading ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                          "Update Password"
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowPasswordChange(false);
                          setProfileData((prev) => ({
                            ...prev,
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          }));
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* <div className="border-t border-gray-800 pt-4">
                  <h3 className="font-medium mb-3">Display Settings</h3>
                  <div className="flex items-center justify-between">
                    <span>Theme</span>
                    <button 
                      onClick={toggleTheme}
                      className="bg-gray-800 text-white px-3 py-2 rounded-lg flex items-center space-x-2"
                    >
                      {darkMode ? (
                        <>
                          <Moon size={16} />
                          <span>Dark</span>
                        </>
                      ) : (
                        <>
                          <Sun size={16} />
                          <span>Light</span>
                        </>
                      )}
                    </button>
                  </div>
                </div> */}
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Help & Support</h2>
            <div className="space-y-2">
              <Link
                to="/documentation"
                className="block text-blue-400 hover:text-blue-300"
              >
                Documentation
              </Link>
              <Link
                to="/api-reference"
                className="block text-blue-400 hover:text-blue-300"
              >
                API Reference
              </Link>
              <Link
                to="/contact"
                className="block text-blue-400 hover:text-blue-300"
              >
                Contact Support
              </Link>
              <Link
                to="/status"
                className="block text-blue-400 hover:text-blue-300"
              >
                System Status
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - AI Settings */}
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">AI Assistant Settings</h2>
              <div className="flex space-x-2">
                <button
                  onClick={resetSettings}
                  className="btn btn-secondary btn-sm"
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full mr-2"></div>
                  ) : (
                    <RefreshCw size={16} />
                  )}
                  Reset
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="btn btn-primary btn-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  Save Changes
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Default AI Model
                </label>
                <select
                  name="defaultModel"
                  value={settings.defaultModel}
                  onChange={handleInputChange}
                  className="input w-full"
                >
                  <option value="gpt-3.5-turbo">Kimi K2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Temperature: {settings.temperature}
                </label>
                <input
                  type="range"
                  name="temperature"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.temperature}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>More Focused</span>
                  <span>More Creative</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Output Tokens: {settings.maxTokens}
                </label>
                <input
                  type="range"
                  name="maxTokens"
                  min="100"
                  max="4000"
                  step="100"
                  value={settings.maxTokens}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Shorter</span>
                  <span>Longer</span>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="font-medium mb-4">Preferences</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Save Chat History</label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="saveHistory"
                        checked={settings.saveHistory}
                        onChange={handleCheckboxChange}
                        disabled={checkboxLoading.saveHistory}
                        className="sr-only peer"
                      />
                      <div
                        className={`relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
                          checkboxLoading.saveHistory ? "opacity-50" : ""
                        }`}
                      >
                        {checkboxLoading.saveHistory && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm">Email Notifications</label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={settings.emailNotifications}
                        onChange={handleCheckboxChange}
                        disabled={checkboxLoading.emailNotifications}
                        className="sr-only peer"
                      />
                      <div
                        className={`relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
                          checkboxLoading.emailNotifications ? "opacity-50" : ""
                        }`}
                      >
                        {checkboxLoading.emailNotifications && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
