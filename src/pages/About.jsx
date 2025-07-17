import { MessageSquare, Database, Shield, Zap, Users, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About QueryNest</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            QueryNest is an innovative AI-powered platform that allows you to create personalized 
            AI assistants trained on your own datasets, providing tailored responses and insights.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="card max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              We believe that AI should be personal and contextual. While general AI assistants are powerful, 
              they lack the specific knowledge and context that makes interactions truly valuable. QueryNest 
              bridges this gap by allowing you to train AI on your own data, creating assistants that understand 
              your unique needs, domain expertise, and specific use cases.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Custom Knowledge Base</h3>
              <p className="text-gray-400">
                Upload your own documents and data to create AI assistants with specialized knowledge 
                in your field or area of interest.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
              <p className="text-gray-400">
                Your data remains secure and private. We use enterprise-grade security measures 
                to protect your information and conversations.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Powered by OpenRouter</h3>
              <p className="text-gray-400">
                We leverage OpenRouter's advanced AI models to provide high-quality, 
                contextual responses based on your custom datasets.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Intuitive Interface</h3>
              <p className="text-gray-400">
                Clean, modern interface designed for seamless conversations. 
                Chat history, dataset management, and personalization all in one place.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personal Dashboard</h3>
              <p className="text-gray-400">
                Comprehensive dashboard to manage your chats, datasets, and AI preferences. 
                Track your usage and organize your knowledge base.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Future API Access</h3>
              <p className="text-gray-400">
                Version 2 will include API access, allowing you to integrate your 
                custom AI assistants into your own applications and workflows.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-16">
          <div className="card max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Built with Modern Technology</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Frontend</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• React 18 with modern hooks and patterns</li>
                  <li>• Responsive design for all devices</li>
                  <li>• Real-time chat interface</li>
                  <li>• Progressive Web App capabilities</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Backend & AI</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• Appwrite for backend services</li>
                  <li>• OpenRouter for AI model access</li>
                  <li>• Secure data storage and encryption</li>
                  <li>• Real-time data synchronization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Vision</h2>
          <div className="card max-w-4xl mx-auto text-center">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              We envision a future where AI assistants are not one-size-fits-all solutions, 
              but rather personalized tools that understand your unique context, knowledge, 
              and requirements. QueryNest is the first step towards making AI truly personal 
              and meaningful for every user.
            </p>
            <p className="text-gray-400">
              Whether you're a researcher, student, professional, or curious learner, 
              QueryNest empowers you to create AI assistants that speak your language 
              and understand your domain.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8">
            Join the future of personalized AI assistance today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="btn btn-primary btn-lg">
              Create Your Account
            </a>
            <a href="/contact" className="btn btn-secondary btn-lg">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
