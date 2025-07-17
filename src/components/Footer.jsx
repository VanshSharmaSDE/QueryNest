import { Link } from 'react-router-dom';
import { MessageSquare, Shield, Database, Mail, Github, Linkedin, Twitter, Star } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative py-20 px-4 bg-gray-950/80 backdrop-blur-xl border-t border-gray-800/50 overflow-hidden">
      {/* Background Gradient Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10">
        {/* Top Section with Logo & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 pb-16 border-b border-gray-800/40">
          <div className="mb-12 lg:mb-0 max-w-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                <span className="text-white font-bold text-lg">QN</span>
              </div>
              <span className="text-2xl font-bold text-white">QueryNest</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Transform your knowledge into intelligent conversations. QueryNest empowers you to create 
              AI assistants that understand your unique data and domain expertise.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-gray-300 hover:bg-blue-600 hover:text-white transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-gray-300 hover:bg-blue-600 hover:text-white transition-colors">
                <Github size={16} />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 text-gray-300 hover:bg-blue-600 hover:text-white transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-auto">
            <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4 max-w-md">Get the latest updates about new features and announcements.</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="input pl-10"
                />
              </div>
              <button className="btn btn-primary whitespace-nowrap">Subscribe</button>
            </div>
          </div>
        </div>
        
        {/* Main Links Section */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>About
              </Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>Contact
              </Link></li>
              <li><Link to="/status" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>Status
              </Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Resources</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/documentation" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-purple-400 rounded-full"></span>Documentation
              </Link></li>
              <li><Link to="/api-reference" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-purple-400 rounded-full"></span>API Reference
              </Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Legal</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/privacy" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-pink-400 rounded-full"></span>Privacy Policy
              </Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-pink-400 rounded-full"></span>Terms of Service
              </Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section with Copyright & Additional Links */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800/40">
          <p className="text-gray-400 mb-4 md:mb-0">&copy; {currentYear} QueryNest. All rights reserved.</p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/documentation" className="hover:text-gray-300 transition-colors">Documentation</Link>
            <Link to="/status" className="flex items-center gap-1 text-blue-400">
              <span>Status</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
