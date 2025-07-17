import { databases } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const CHAT_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_CHATS_ID;
const MESSAGE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_MESSAGES_ID;

export const chatService = {
  /**
   * Create a new chat
   * @param {string} userId - The user ID
   * @param {string} title - Chat title
   * @param {string} [datasetId] - Optional dataset ID
   * @returns {Promise<object>} - Created chat object
   */
  async createChat(userId, title, datasetId = null) {
    try {
      const chat = {
        user_id: userId,
        title: title,
        dataset_id: datasetId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return await databases.createDocument(
        DATABASE_ID,
        CHAT_COLLECTION_ID,
        ID.unique(),
        chat
      );
    } catch (error) {
      console.error("AppWrite service :: createChat :: ", error);
      throw error;
    }
  },

  /**
   * Get all chats for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} - List of chats
   */
  async getUserChats(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CHAT_COLLECTION_ID,
        [
          Query.equal('user_id', userId),
          Query.orderDesc('updated_at')
        ]
      );
      return response.documents;
    } catch (error) {
      console.error("AppWrite service :: getUserChats :: ", error);
      throw error;
    }
  },

  /**
   * Get a chat by ID
   * @param {string} chatId - The chat ID
   * @returns {Promise<object>} - Chat object
   */
  async getChat(chatId) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        CHAT_COLLECTION_ID,
        chatId
      );
    } catch (error) {
      console.error("AppWrite service :: getChat :: ", error);
      throw error;
    }
  },

  /**
   * Update a chat
   * @param {string} chatId - The chat ID
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} - Updated chat object
   */
  async updateChat(chatId, updates) {
    try {
      const updatedChat = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return await databases.updateDocument(
        DATABASE_ID,
        CHAT_COLLECTION_ID,
        chatId,
        updatedChat
      );
    } catch (error) {
      console.error("AppWrite service :: updateChat :: ", error);
      throw error;
    }
  },

  /**
   * Delete a chat
   * @param {string} chatId - The chat ID
   * @returns {Promise<void>}
   */
  async deleteChat(chatId) {
    try {
      // Delete all messages in the chat first
      await this.deleteAllMessages(chatId);
      
      // Then delete the chat
      return await databases.deleteDocument(
        DATABASE_ID,
        CHAT_COLLECTION_ID,
        chatId
      );
    } catch (error) {
      console.error("AppWrite service :: deleteChat :: ", error);
      throw error;
    }
  },

  /**
   * Create a new message
   * @param {string} chatId - The chat ID
   * @param {string} userId - The user ID
   * @param {string} role - Message role (user, assistant, system)
   * @param {string} content - Message content
   * @param {string} [model] - AI model used (for assistant messages)
   * @returns {Promise<object>} - Created message object
   */
  async createMessage(chatId, userId, role, content, model = null) {
    try {
    const message = {
      chat_id: chatId,
      user_id: userId,
      role: role,
      content: content,
      created_at: new Date().toISOString(),
      model: model,
      tokens: this.estimateTokens(content)
    };
      
      const createdMessage = await databases.createDocument(
        DATABASE_ID,
        MESSAGE_COLLECTION_ID,
        ID.unique(),
        message
      );
      
      // Update the chat's updated_at timestamp
      await this.updateChat(chatId, {});
      
      return createdMessage;
    } catch (error) {
      console.error("AppWrite service :: createMessage :: ", error);
      throw error;
    }
  },

  /**
   * Get all messages for a chat
   * @param {string} chatId - The chat ID
   * @returns {Promise<Array>} - List of messages
   */
  async getChatMessages(chatId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        MESSAGE_COLLECTION_ID,
        [
          Query.equal('chat_id', chatId),
          Query.orderAsc('created_at')
        ]
      );
      return response.documents;
    } catch (error) {
      console.error("AppWrite service :: getChatMessages :: ", error);
      throw error;
    }
  },

  /**
   * Delete all messages for a chat
   * @param {string} chatId - The chat ID
   * @returns {Promise<void>}
   */
  async deleteAllMessages(chatId) {
    try {
      const messages = await this.getChatMessages(chatId);
      
      // Delete each message
      const deletePromises = messages.map(message => 
        databases.deleteDocument(
          DATABASE_ID,
          MESSAGE_COLLECTION_ID,
          message.$id
        )
      );
      
      return Promise.all(deletePromises);
    } catch (error) {
      console.error("AppWrite service :: deleteAllMessages :: ", error);
      throw error;
    }
  },

  /**
   * Very simple token estimator (1 token ≈ 4 chars)
   * This is just an approximation - real token count depends on tokenizer
   * @param {string} text - The text to estimate tokens for
   * @returns {number} - Estimated token count
   */
  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }
};
