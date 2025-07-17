import { useState } from 'react';
import { Search, Code, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';

const ApiReference = () => {
  const [copiedText, setCopiedText] = useState(null);
  const [expandedSection, setExpandedSection] = useState('authentication');

  const handleCopyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Mock API endpoint data
  const endpoints = {
    authentication: [
      {
        id: 'auth-1',
        method: 'POST',
        path: '/api/auth/login',
        description: 'Authenticate user and retrieve access token',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password' }
        ],
        response: {
          success: true,
          data: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user: {
              id: '123',
              name: 'John Doe',
              email: 'john@example.com'
            }
          }
        },
        code: `fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'your-password'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`
      },
      {
        id: 'auth-2',
        method: 'POST',
        path: '/api/auth/register',
        description: 'Create a new user account',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'User full name' },
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password' }
        ],
        response: {
          success: true,
          data: {
            user: {
              id: '123',
              name: 'John Doe',
              email: 'john@example.com'
            }
          }
        },
        code: `fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'your-password'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`
      }
    ],
    chats: [
      {
        id: 'chat-1',
        method: 'GET',
        path: '/api/chats',
        description: 'Retrieve all chats for authenticated user',
        parameters: [],
        response: {
          success: true,
          data: {
            chats: [
              {
                id: '1',
                title: 'Product Discussion',
                lastMessage: 'What features are included?',
                createdAt: '2025-07-10T15:30:00Z'
              }
            ]
          }
        },
        code: `fetch('/api/chats', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`
      },
      {
        id: 'chat-2',
        method: 'POST',
        path: '/api/chats/messages',
        description: 'Send a message to an AI assistant',
        parameters: [
          { name: 'chatId', type: 'string', required: true, description: 'Chat identifier' },
          { name: 'message', type: 'string', required: true, description: 'Message content' }
        ],
        response: {
          success: true,
          data: {
            message: 'Message sent successfully',
            response: {
              id: '456',
              content: 'Here is my response to your question.',
              createdAt: '2025-07-10T15:32:00Z'
            }
          }
        },
        code: `fetch('/api/chats/messages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    chatId: '1',
    message: 'What features are included?'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`
      }
    ],
    datasets: [
      {
        id: 'dataset-1',
        method: 'POST',
        path: '/api/datasets',
        description: 'Upload a new dataset for training an AI assistant',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Dataset name' },
          { name: 'file', type: 'file', required: true, description: 'Dataset file (PDF, TXT, etc.)' }
        ],
        response: {
          success: true,
          data: {
            dataset: {
              id: '789',
              name: 'Product Documentation',
              status: 'processing',
              createdAt: '2025-07-10T15:35:00Z'
            }
          }
        },
        code: `const formData = new FormData();
formData.append('name', 'Product Documentation');
formData.append('file', fileInput.files[0]);

fetch('/api/datasets', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`
      },
      {
        id: 'dataset-2',
        method: 'GET',
        path: '/api/datasets',
        description: 'Retrieve all datasets for authenticated user',
        parameters: [],
        response: {
          success: true,
          data: {
            datasets: [
              {
                id: '789',
                name: 'Product Documentation',
                status: 'ready',
                createdAt: '2025-07-10T15:35:00Z'
              }
            ]
          }
        },
        code: `fetch('/api/datasets', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`
      }
    ]
  };

  const renderMethod = (method) => {
    const colors = {
      GET: 'bg-green-500/20 text-green-400',
      POST: 'bg-blue-500/20 text-blue-400',
      PUT: 'bg-orange-500/20 text-orange-400',
      DELETE: 'bg-red-500/20 text-red-400'
    };
    
    return (
      <span className={`${colors[method]} px-2 py-1 rounded text-xs font-mono`}>
        {method}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12">
      <div className="container px-4">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              API <span className="text-gradient">Reference</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Complete reference documentation for the QueryNest API
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search API endpoints..."
                className="input pl-12 py-4 w-full"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-64 shrink-0">
              <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 sticky top-24">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-2">API Endpoints</h3>
                  
                  <div>
                    <button 
                      className={`flex items-center justify-between w-full p-2 rounded ${expandedSection === 'authentication' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300'}`}
                      onClick={() => toggleSection('authentication')}
                    >
                      <span>Authentication</span>
                      {expandedSection === 'authentication' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    
                    {expandedSection === 'authentication' && (
                      <div className="pl-4 mt-2 space-y-2">
                        {endpoints.authentication.map(endpoint => (
                          <a
                            key={endpoint.id}
                            href={`#${endpoint.id}`}
                            className="block text-sm py-1 px-2 text-gray-400 hover:text-white"
                          >
                            {endpoint.path}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <button 
                      className={`flex items-center justify-between w-full p-2 rounded ${expandedSection === 'chats' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300'}`}
                      onClick={() => toggleSection('chats')}
                    >
                      <span>Chats</span>
                      {expandedSection === 'chats' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    
                    {expandedSection === 'chats' && (
                      <div className="pl-4 mt-2 space-y-2">
                        {endpoints.chats.map(endpoint => (
                          <a
                            key={endpoint.id}
                            href={`#${endpoint.id}`}
                            className="block text-sm py-1 px-2 text-gray-400 hover:text-white"
                          >
                            {endpoint.path}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <button 
                      className={`flex items-center justify-between w-full p-2 rounded ${expandedSection === 'datasets' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-300'}`}
                      onClick={() => toggleSection('datasets')}
                    >
                      <span>Datasets</span>
                      {expandedSection === 'datasets' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    
                    {expandedSection === 'datasets' && (
                      <div className="pl-4 mt-2 space-y-2">
                        {endpoints.datasets.map(endpoint => (
                          <a
                            key={endpoint.id}
                            href={`#${endpoint.id}`}
                            className="block text-sm py-1 px-2 text-gray-400 hover:text-white"
                          >
                            {endpoint.path}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div>
                {/* Authentication Section */}
                <section id="authentication" className="mb-16">
                  <h2 className="text-3xl font-bold mb-8 pb-4 border-b border-gray-800">Authentication</h2>
                  
                  <div className="space-y-12">
                    {endpoints.authentication.map((endpoint) => (
                      <div key={endpoint.id} id={endpoint.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          {renderMethod(endpoint.method)}
                          <h3 className="text-xl font-bold ml-3">{endpoint.path}</h3>
                        </div>
                        
                        <p className="text-gray-300 mb-6">{endpoint.description}</p>
                        
                        {endpoint.parameters.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-white font-bold mb-3">Parameters</h4>
                            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-800">
                                    <th className="text-left p-3 text-gray-400">Name</th>
                                    <th className="text-left p-3 text-gray-400">Type</th>
                                    <th className="text-left p-3 text-gray-400">Required</th>
                                    <th className="text-left p-3 text-gray-400">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {endpoint.parameters.map((param, index) => (
                                    <tr key={index} className="border-b border-gray-800 last:border-b-0">
                                      <td className="p-3 font-mono text-blue-400">{param.name}</td>
                                      <td className="p-3 font-mono text-green-400">{param.type}</td>
                                      <td className="p-3">{param.required ? 'Yes' : 'No'}</td>
                                      <td className="p-3 text-gray-300">{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-6">
                          <h4 className="text-white font-bold mb-3">Response</h4>
                          <div className="relative">
                            <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
                              <code className="text-gray-300 text-sm">
                                {JSON.stringify(endpoint.response, null, 2)}
                              </code>
                            </pre>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-white font-bold mb-3">Example Request</h4>
                          <div className="relative">
                            <div className="absolute right-4 top-4">
                              <button 
                                onClick={() => handleCopyCode(endpoint.code, endpoint.id)}
                                className="text-gray-400 hover:text-white"
                              >
                                {copiedText === endpoint.id ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                              </button>
                            </div>
                            <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
                              <code className="text-gray-300 text-sm">{endpoint.code}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Chats Section */}
                <section id="chats" className="mb-16">
                  <h2 className="text-3xl font-bold mb-8 pb-4 border-b border-gray-800">Chats</h2>
                  
                  <div className="space-y-12">
                    {endpoints.chats.map((endpoint) => (
                      <div key={endpoint.id} id={endpoint.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          {renderMethod(endpoint.method)}
                          <h3 className="text-xl font-bold ml-3">{endpoint.path}</h3>
                        </div>
                        
                        <p className="text-gray-300 mb-6">{endpoint.description}</p>
                        
                        {endpoint.parameters.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-white font-bold mb-3">Parameters</h4>
                            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-800">
                                    <th className="text-left p-3 text-gray-400">Name</th>
                                    <th className="text-left p-3 text-gray-400">Type</th>
                                    <th className="text-left p-3 text-gray-400">Required</th>
                                    <th className="text-left p-3 text-gray-400">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {endpoint.parameters.map((param, index) => (
                                    <tr key={index} className="border-b border-gray-800 last:border-b-0">
                                      <td className="p-3 font-mono text-blue-400">{param.name}</td>
                                      <td className="p-3 font-mono text-green-400">{param.type}</td>
                                      <td className="p-3">{param.required ? 'Yes' : 'No'}</td>
                                      <td className="p-3 text-gray-300">{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-6">
                          <h4 className="text-white font-bold mb-3">Response</h4>
                          <div className="relative">
                            <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
                              <code className="text-gray-300 text-sm">
                                {JSON.stringify(endpoint.response, null, 2)}
                              </code>
                            </pre>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-white font-bold mb-3">Example Request</h4>
                          <div className="relative">
                            <div className="absolute right-4 top-4">
                              <button 
                                onClick={() => handleCopyCode(endpoint.code, endpoint.id)}
                                className="text-gray-400 hover:text-white"
                              >
                                {copiedText === endpoint.id ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                              </button>
                            </div>
                            <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
                              <code className="text-gray-300 text-sm">{endpoint.code}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Datasets Section */}
                <section id="datasets" className="mb-16">
                  <h2 className="text-3xl font-bold mb-8 pb-4 border-b border-gray-800">Datasets</h2>
                  
                  <div className="space-y-12">
                    {endpoints.datasets.map((endpoint) => (
                      <div key={endpoint.id} id={endpoint.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          {renderMethod(endpoint.method)}
                          <h3 className="text-xl font-bold ml-3">{endpoint.path}</h3>
                        </div>
                        
                        <p className="text-gray-300 mb-6">{endpoint.description}</p>
                        
                        {endpoint.parameters.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-white font-bold mb-3">Parameters</h4>
                            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-800">
                                    <th className="text-left p-3 text-gray-400">Name</th>
                                    <th className="text-left p-3 text-gray-400">Type</th>
                                    <th className="text-left p-3 text-gray-400">Required</th>
                                    <th className="text-left p-3 text-gray-400">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {endpoint.parameters.map((param, index) => (
                                    <tr key={index} className="border-b border-gray-800 last:border-b-0">
                                      <td className="p-3 font-mono text-blue-400">{param.name}</td>
                                      <td className="p-3 font-mono text-green-400">{param.type}</td>
                                      <td className="p-3">{param.required ? 'Yes' : 'No'}</td>
                                      <td className="p-3 text-gray-300">{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-6">
                          <h4 className="text-white font-bold mb-3">Response</h4>
                          <div className="relative">
                            <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
                              <code className="text-gray-300 text-sm">
                                {JSON.stringify(endpoint.response, null, 2)}
                              </code>
                            </pre>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-white font-bold mb-3">Example Request</h4>
                          <div className="relative">
                            <div className="absolute right-4 top-4">
                              <button 
                                onClick={() => handleCopyCode(endpoint.code, endpoint.id)}
                                className="text-gray-400 hover:text-white"
                              >
                                {copiedText === endpoint.id ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                              </button>
                            </div>
                            <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
                              <code className="text-gray-300 text-sm">{endpoint.code}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiReference;
