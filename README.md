# QueryNest 🚀

A modern AI-powered chat application that allows users to create personalized AI assistants with custom datasets. Built with React, powered by OpenRouter AI, and backed by Appwrite.

![QueryNest](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### 🤖 AI-Powered Conversations
- **Advanced AI Models**: Powered by OpenRouter with access to GPT-4 and other cutting-edge models
- **Custom Dataset Training**: Upload your own text files to create personalized AI assistants
- **Real-time Chat**: Smooth, responsive chat interface with typing indicators
- **Context Awareness**: AI maintains conversation context and references your custom data

### 🔐 Secure Authentication
- **User Management**: Secure authentication system powered by Appwrite
- **Personal Accounts**: Individual user accounts with private data storage
- **Session Management**: Persistent login sessions with secure token handling

### 📊 Personal Dashboard
- **Chat History**: View and manage all your conversation history
- **Dataset Management**: Upload, organize, and manage your custom datasets
- **Usage Analytics**: Track your conversations and data usage
- **Quick Actions**: Easy access to start new chats and upload datasets

### 🎨 Modern Design
- **Dark Theme**: Professional dark theme with blue accents
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Intuitive Interface**: Clean, modern UI designed for productivity
- **Accessibility**: Built with accessibility best practices

### 🚀 Coming in Version 2
- **API Access**: RESTful API for integrating your custom AI into other applications
- **Team Collaboration**: Share datasets and collaborate with team members
- **Advanced Analytics**: Detailed insights into AI performance and usage patterns
- **Multi-format Support**: Support for PDFs, Word documents, and more file types

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing for single-page application
- **Lucide React**: Beautiful, customizable icons
- **React Hot Toast**: Elegant notification system

### Backend & Services
- **Appwrite**: Backend-as-a-Service for authentication, database, and storage
- **OpenRouter**: AI model access and management
- **Custom CSS**: Professional styling with CSS custom properties

### Development Tools
- **ESLint**: Code linting and formatting
- **Vite HMR**: Hot module replacement for fast development
- **Modern JavaScript**: ES6+ features and best practices

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser
- Appwrite account (for backend services)
- OpenRouter API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/querynest.git
   cd querynest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the example environment file and update with your configuration:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your API keys:
   ```env
   # OpenRouter API Configuration
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   VITE_SITE_URL=http://localhost:5173
   VITE_SITE_NAME=QueryNest

   # Appwrite Configuration
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
   VITE_APPWRITE_DATABASE_ID=your_database_id
   VITE_APPWRITE_COLLECTION_CHATS_ID=chats
   VITE_APPWRITE_COLLECTION_DATASETS_ID=datasets
   VITE_APPWRITE_COLLECTION_USERS_ID=user_settings
   VITE_APPWRITE_STORAGE_ID=querynest_storage
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

## 📱 Usage

### Getting Started
1. **Create an Account**: Sign up with your email and password
2. **Access Dashboard**: View your personal dashboard after login
3. **Upload Datasets**: Add custom text files to train your AI assistant
4. **Start Chatting**: Begin conversations with your personalized AI

### Managing Datasets
- Upload `.txt` files containing your custom knowledge base
- Select different datasets for different conversation contexts
- Delete or update datasets as needed
- Switch between general AI and custom dataset modes

### Chat Features
- **Real-time Responses**: Get instant AI responses
- **Context Preservation**: AI remembers conversation history
- **Dataset Selection**: Choose which dataset to use for each chat
- **Export Conversations**: Save important conversations

## 🤝 Contributing

We welcome contributions to QueryNest! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **OpenRouter** for providing access to advanced AI models
- **Appwrite** for excellent backend-as-a-service platform
- **React Team** for the amazing framework
- **Lucide** for beautiful icons
- **Vite** for the fast development experience

## 📞 Support & Contact

- **Email**: support@querynest.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/querynest/issues)

---

**Built with ❤️ by the QueryNest Team**
