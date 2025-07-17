import { useState } from 'react';
import { ChevronDown, Search, Bookmark, FileText, Code, ExternalLink, Copy, Check } from 'lucide-react';

const Documentation = () => {
  const [copiedText, setCopiedText] = useState(null);
  const [activeTab, setActiveTab] = useState('getting-started');

  const handleCopyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const docs = {
    gettingStarted: [
      {
        id: 'gs-1',
        title: 'Introduction',
        content: 'QueryNest is an AI-powered chat application that allows you to create personalized AI assistants by uploading custom datasets.',
      },
      {
        id: 'gs-2',
        title: 'Installation',
        content: 'Get started with QueryNest by signing up for an account and setting up your first AI assistant.',
        code: `npm install querynest-client
# or
yarn add querynest-client`
      },
      {
        id: 'gs-3',
        title: 'Quick Start',
        content: 'Follow these steps to create your first AI assistant with a custom dataset.',
      }
    ],
    guides: [
      {
        id: 'g-1',
        title: 'Uploading Datasets',
        content: 'Learn how to upload and manage custom datasets for your AI assistants.',
      },
      {
        id: 'g-2',
        title: 'Configuring Chat Settings',
        content: 'Customize the behavior of your AI assistant by configuring chat settings.',
      },
      {
        id: 'g-3',
        title: 'Managing Chat History',
        content: 'Learn how to view, export, and delete your chat history.',
      }
    ],
    apiReference: [
      {
        id: 'api-1',
        title: 'Authentication',
        content: 'Learn how to authenticate with the QueryNest API.',
      },
      {
        id: 'api-2',
        title: 'Chat Endpoints',
        content: 'API endpoints for interacting with AI assistants.',
      },
      {
        id: 'api-3',
        title: 'Dataset Endpoints',
        content: 'API endpoints for managing custom datasets.',
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12">
      <div className="container px-4">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              QueryNest <span className="text-gradient">Documentation</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Everything you need to know about building with QueryNest
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search documentation..."
                className="input pl-12 py-4 w-full"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-64 shrink-0">
              <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 sticky top-24">
                <nav className="space-y-1">
                  <div className="mb-4">
                    <div className="text-white font-semibold mb-2 flex items-center">
                      <FileText size={16} className="mr-2" />
                      <span>Getting Started</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {docs.gettingStarted.map((item) => (
                        <a 
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block text-sm py-1 px-2 rounded ${activeTab === item.id ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:text-white'}`}
                          onClick={() => setActiveTab(item.id)}
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-white font-semibold mb-2 flex items-center">
                      <Bookmark size={16} className="mr-2" />
                      <span>Guides</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {docs.guides.map((item) => (
                        <a 
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block text-sm py-1 px-2 rounded ${activeTab === item.id ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:text-white'}`}
                          onClick={() => setActiveTab(item.id)}
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-white font-semibold mb-2 flex items-center">
                      <Code size={16} className="mr-2" />
                      <span>API Reference</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {docs.apiReference.map((item) => (
                        <a 
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block text-sm py-1 px-2 rounded ${activeTab === item.id ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:text-white'}`}
                          onClick={() => setActiveTab(item.id)}
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="prose prose-invert max-w-none">
                {/* Getting Started Section */}
                <section id="getting-started" className="mb-16">
                  <h2 className="text-3xl font-bold mb-8 pb-4 border-b border-gray-800">Getting Started</h2>
                  
                  {docs.gettingStarted.map((item) => (
                    <div key={item.id} id={item.id} className="mb-12">
                      <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                      <p className="text-gray-300 mb-4">{item.content}</p>
                      
                      {item.code && (
                        <div className="relative mt-6">
                          <div className="absolute right-4 top-4">
                            <button 
                              onClick={() => handleCopyCode(item.code, item.id)}
                              className="text-gray-400 hover:text-white"
                            >
                              {copiedText === item.id ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                            </button>
                          </div>
                          <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-x-auto">
                            <code className="text-gray-300 text-sm">{item.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </section>

                {/* Guides Section */}
                <section id="guides" className="mb-16">
                  <h2 className="text-3xl font-bold mb-8 pb-4 border-b border-gray-800">Guides</h2>
                  
                  {docs.guides.map((item) => (
                    <div key={item.id} id={item.id} className="mb-12">
                      <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                      <p className="text-gray-300 mb-4">{item.content}</p>
                    </div>
                  ))}
                </section>

                {/* API Reference Section */}
                <section id="api-reference" className="mb-16">
                  <h2 className="text-3xl font-bold mb-8 pb-4 border-b border-gray-800">API Reference</h2>
                  
                  <div className="mb-8">
                    <p className="text-gray-300">
                      For full API documentation, please visit our dedicated{' '}
                      <a href="/api-reference" className="text-blue-400 hover:text-blue-300 inline-flex items-center">
                        API Reference <ExternalLink size={14} className="ml-1" />
                      </a>
                    </p>
                  </div>
                  
                  {docs.apiReference.map((item) => (
                    <div key={item.id} id={item.id} className="mb-12">
                      <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                      <p className="text-gray-300 mb-4">{item.content}</p>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
