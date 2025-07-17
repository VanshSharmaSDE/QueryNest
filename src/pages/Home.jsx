import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Shield, Zap, Database, Users, Star, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 blur-3xl"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles size={16} />
            <span>Powered by Advanced AI Technology</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <span className="text-gradient block">QueryNest</span>
            <span className="text-white/90 text-4xl md:text-5xl font-light">Your AI Knowledge Hub</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your data into intelligent conversations. Upload custom datasets, 
            train your AI, and get personalized responses tailored to your unique knowledge base.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register" className="btn btn-primary btn-lg group">
              <span>Start Building Free</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              <span>Explore Features</span>
            </Link>
          </div>
          
          <div className="mt-16 text-sm text-gray-400">
            <p>No credit card required • 5-minute setup • Enterprise-grade security</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 relative">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Why Choose <span className="text-gradient">QueryNest</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the next generation of AI-powered knowledge management with our cutting-edge platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card group">
              <div className="feature-icon">
                <MessageSquare className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">
                Intelligent Conversations
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Powered by state-of-the-art AI models through OpenRouter. Experience human-like conversations 
                with context-aware responses that understand your specific domain.
              </p>
            </div>

            <div className="feature-card group">
              <div className="feature-icon">
                <Database className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors">
                Custom Knowledge Base
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Upload and train your AI on proprietary data. Transform documents, research, and expertise 
                into intelligent, searchable knowledge that delivers precise answers.
              </p>
            </div>

            <div className="feature-card group">
              <div className="feature-icon">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-green-300 transition-colors">
                Enterprise Security
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Bank-level encryption and privacy protection. Your sensitive data remains secure with 
                industry-leading security measures and compliance standards.
              </p>
            </div>

            <div className="feature-card group">
              <div className="feature-icon">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-yellow-300 transition-colors">
                Lightning Performance
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Optimized infrastructure delivers instant responses. Real-time streaming conversations 
                with sub-second latency for seamless user experience.
              </p>
            </div>

            <div className="feature-card group">
              <div className="feature-icon">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-300 transition-colors">
                Collaborative Workspace
              </h3>
              <p className="text-gray-400 leading-relaxed">
                <span className="text-blue-400 font-semibold">Coming Soon:</span> Centralized dashboard for team collaboration. Manage conversations, datasets, and 
                analytics from one powerful, intuitive interface.
              </p>
            </div>

            <div className="feature-card group">
              <div className="feature-icon">
                <Star className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-pink-300 transition-colors">
                API Integration
              </h3>
              <p className="text-gray-400 leading-relaxed">
                <span className="text-blue-400 font-semibold">Coming Soon:</span> Seamless API access 
                for custom integrations. Build your AI directly into existing workflows and applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
        <div className="container relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in minutes with our streamlined onboarding process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-black text-3xl">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Create Account</h3>
              <p className="text-gray-400 leading-relaxed">
                Sign up with your email and get instant access to your personal AI workspace. 
                No complex setup required.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-black text-3xl">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Upload Knowledge</h3>
              <p className="text-gray-400 leading-relaxed">
                Simply drag and drop your documents, research, or any text files. 
                Our AI instantly processes and learns from your data.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-pink-500/25 group-hover:shadow-pink-500/40 transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-black text-3xl">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Start Conversations</h3>
              <p className="text-gray-400 leading-relaxed">
                Ask questions and get intelligent responses based on your custom knowledge. 
                Experience AI that truly understands your domain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/50 to-transparent"></div>
        
        <div className="container relative z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">
            Ready to Transform Your <span className="text-gradient">Knowledge</span>?
          </h2>
          <p className="text-xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals and organizations who are already using QueryNest 
            to unlock the power of their data through intelligent AI conversations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link to="/register" className="btn btn-primary btn-lg group text-lg px-12 py-4">
              <span>Start Your AI Journey</span>
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg text-lg px-12 py-4">
              <span>Talk to Our Team</span>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>No credit card needed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
