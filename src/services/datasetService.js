import { databases } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const DATASET_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_DATASETS_ID;

export const datasetService = {
  /**
   * Create a new dataset
   * @param {string} userId - The user ID
   * @param {string} name - Dataset name
   * @param {string} content - Dataset content
   * @param {string} format - Dataset format (txt, json, csv)
   * @param {object} [schema] - Optional schema for structured data
   * @returns {Promise<object>} - Created dataset object
   */
  async createDataset(userId, name, content, format, schema = null) {
    try {
      const dataset = {
        user_id: userId,
        name: name,
        content: content,
        format: format,
        size: new Blob([content]).size,
        schema: schema,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return await databases.createDocument(
        DATABASE_ID,
        DATASET_COLLECTION_ID,
        ID.unique(),
        dataset
      );
    } catch (error) {
      console.error("AppWrite service :: createDataset :: ", error);
      throw error;
    }
  },

  /**
   * Get all datasets for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} - List of datasets
   */
  async getUserDatasets(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        DATASET_COLLECTION_ID,
        [
          Query.equal('user_id', userId),
          Query.orderDesc('created_at')
        ]
      );
      return response.documents;
    } catch (error) {
      console.error("AppWrite service :: getUserDatasets :: ", error);
      throw error;
    }
  },

  /**
   * Get a dataset by ID
   * @param {string} datasetId - The dataset ID
   * @returns {Promise<object>} - Dataset object
   */
  async getDataset(datasetId) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        DATASET_COLLECTION_ID,
        datasetId
      );
    } catch (error) {
      console.error("AppWrite service :: getDataset :: ", error);
      throw error;
    }
  },

  /**
   * Update a dataset
   * @param {string} datasetId - The dataset ID
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} - Updated dataset object
   */
  async updateDataset(datasetId, updates) {
    try {
      const updatedDataset = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // If content is updated, recalculate size
      if (updates.content) {
        updatedDataset.size = new Blob([updates.content]).size;
      }
      
      return await databases.updateDocument(
        DATABASE_ID,
        DATASET_COLLECTION_ID,
        datasetId,
        updatedDataset
      );
    } catch (error) {
      console.error("AppWrite service :: updateDataset :: ", error);
      throw error;
    }
  },

  /**
   * Delete a dataset
   * @param {string} datasetId - The dataset ID
   * @returns {Promise<void>}
   */
  async deleteDataset(datasetId) {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        DATASET_COLLECTION_ID,
        datasetId
      );
    } catch (error) {
      console.error("AppWrite service :: deleteDataset :: ", error);
      throw error;
    }
  },

  /**
   * Update dataset last used timestamp
   * @param {string} datasetId - The dataset ID
   * @returns {Promise<object>} - Updated dataset object
   */
  async updateDatasetLastUsed(datasetId) {
    try {
      return await this.updateDataset(datasetId, {
        last_used: new Date().toISOString()
      });
    } catch (error) {
      console.error("AppWrite service :: updateDatasetLastUsed :: ", error);
      throw error;
    }
  },

  /**
   * Detect and validate dataset format
   * @param {string} content - Dataset content
   * @returns {object} - Format info {format, isValid, schema}
   */
  detectFormat(content) {
    try {
      // Try parsing as JSON
      const jsonData = JSON.parse(content);
      return {
        format: 'json',
        isValid: true,
        schema: this.extractJsonSchema(jsonData)
      };
    } catch (e) {
      // Check if it's a CSV by looking for commas and newlines
      const lines = content.trim().split('\n');
      if (lines.length > 0) {
        const firstLine = lines[0];
        if (firstLine.includes(',')) {
          // Simple CSV validation - all rows should have same number of columns
          const columnCount = firstLine.split(',').length;
          const isValid = lines.every(line => line.split(',').length === columnCount);
          return {
            format: 'csv',
            isValid
          };
        }
      }
      
      // Assume it's plain text or key-value format
      return {
        format: 'txt',
        isValid: true
      };
    }
  },

  /**
   * Extract a simple schema from JSON data
   * @param {object} data - JSON data
   * @returns {object} - Simple schema object
   */
  extractJsonSchema(data) {
    const schema = {};
    
    // Helper function to get type
    const getType = (value) => {
      if (Array.isArray(value)) {
        return 'array';
      }
      if (value === null) {
        return 'null';
      }
      return typeof value;
    };
    
    // Helper function to extract schema recursively
    const extractSchema = (obj, currentPath = '') => {
      if (typeof obj !== 'object' || obj === null) {
        return;
      }
      
      if (Array.isArray(obj)) {
        if (obj.length > 0) {
          // Just check the first item in the array
          const firstItem = obj[0];
          const itemType = getType(firstItem);
          
          if (itemType === 'object') {
            extractSchema(firstItem, `${currentPath}[0]`);
          } else {
            schema[`${currentPath}`] = {
              type: 'array',
              items: itemType,
              count: obj.length
            };
          }
        } else {
          schema[currentPath] = {
            type: 'array',
            items: 'unknown',
            count: 0
          };
        }
      } else {
        // Process object properties
        for (const key in obj) {
          const value = obj[key];
          const type = getType(value);
          const path = currentPath ? `${currentPath}.${key}` : key;
          
          if (type === 'object') {
            extractSchema(value, path);
          } else if (type === 'array') {
            extractSchema(value, path);
          } else {
            schema[path] = { type };
          }
        }
      }
    };
    
    extractSchema(data);
    return schema;
  }
};
