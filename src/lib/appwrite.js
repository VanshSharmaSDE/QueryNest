import { Client, Account, Databases, Storage, Query } from 'appwrite';

const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'querynest-db';

export const COLLECTIONS = {
  USERS: import.meta.env.VITE_APPWRITE_COLLECTION_USERS_ID || 'users',
  CHATS: import.meta.env.VITE_APPWRITE_COLLECTION_CHATS_ID || 'chats',
  DATASETS: import.meta.env.VITE_APPWRITE_COLLECTION_DATASETS_ID || 'datasets',
  SETTINGS: import.meta.env.VITE_APPWRITE_COLLECTION_SETTINGS_ID || 'settings'
};

export { Query };
export default client;
