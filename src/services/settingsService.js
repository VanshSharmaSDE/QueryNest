import { databases } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USER_SETTINGS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_SETTINGS_ID;

export const settingsService = {
  /**
   * Get user settings
   * @param {string} userId - The user ID
   * @returns {Promise<object>} - User settings
   */
  async getUserSettings(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USER_SETTINGS_COLLECTION_ID,
        [Query.equal('user_id', userId)]
      );
      
      if (response.documents.length > 0) {
        return response.documents[0];
      } else {
        // If no settings exist, create default settings
        return await this.createDefaultSettings(userId);
      }
    } catch (error) {
      console.error("AppWrite service :: getUserSettings :: ", error);
      throw error;
    }
  },

  /**
   * Create default settings for a user
   * @param {string} userId - The user ID
   * @returns {Promise<object>} - Created settings object
   */
  async createDefaultSettings(userId) {
    try {
      const defaultSettings = {
        user_id: userId,
        theme: 'system',
        default_model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000,
        chat_history_enabled: true,
        notifications_enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return await databases.createDocument(
        DATABASE_ID,
        USER_SETTINGS_COLLECTION_ID,
        ID.unique(),
        defaultSettings
      );
    } catch (error) {
      console.error("AppWrite service :: createDefaultSettings :: ", error);
      throw error;
    }
  },

  /**
   * Update user settings
   * @param {string} settingsId - The settings document ID
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} - Updated settings object
   */
  async updateSettings(settingsId, updates) {
    try {
      const updatedSettings = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return await databases.updateDocument(
        DATABASE_ID,
        USER_SETTINGS_COLLECTION_ID,
        settingsId,
        updatedSettings
      );
    } catch (error) {
      console.error("AppWrite service :: updateSettings :: ", error);
      throw error;
    }
  },

  /**
   * Update theme setting
   * @param {string} userId - The user ID
   * @param {string} theme - Theme value (light, dark, system)
   * @returns {Promise<object>} - Updated settings object
   */
  async updateTheme(userId, theme) {
    try {
      const settings = await this.getUserSettings(userId);
      return await this.updateSettings(settings.$id, { theme });
    } catch (error) {
      console.error("AppWrite service :: updateTheme :: ", error);
      throw error;
    }
  },

  /**
   * Update model settings
   * @param {string} userId - The user ID
   * @param {object} modelSettings - Model settings (default_model, temperature, max_tokens)
   * @returns {Promise<object>} - Updated settings object
   */
  async updateModelSettings(userId, modelSettings) {
    try {
      const settings = await this.getUserSettings(userId);
      return await this.updateSettings(settings.$id, modelSettings);
    } catch (error) {
      console.error("AppWrite service :: updateModelSettings :: ", error);
      throw error;
    }
  }
};
