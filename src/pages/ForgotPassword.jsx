import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.sendPasswordRecoveryEmail(email);
      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-8">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 blur-3xl"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="w-full max-w-md relative z-10 mt-16">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <span className="text-white font-bold text-xl">QN</span>
              </div>
              <span className="text-3xl font-bold text-white">QueryNest</span>
            </div>
          </div>

          {/* Success Card */}
          <div className="card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">
              Check Your Email
            </h1>
            
            <p className="text-gray-400 mb-6">
              We've sent a password reset link to:
            </p>
            
            <p className="text-blue-400 font-medium mb-8 bg-blue-500/10 rounded-lg p-3">
              {email}
            </p>
            
            <p className="text-sm text-gray-500 mb-8">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="btn btn-secondary w-full"
              >
                Try Different Email
              </button>
              
              <Link 
                to="/login" 
                className="btn btn-primary w-full"
              >
                <ArrowLeft size={20} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 blur-3xl"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="w-full max-w-md relative z-10 mt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
              <span className="text-white font-bold text-xl">QN</span>
            </div>
            <span className="text-3xl font-bold text-white">QueryNest</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
            Reset <span className="text-gradient">Password</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Forgot Password Form */}
        <div className="card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-12 w-full h-14 text-lg"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="btn btn-primary w-full h-14 text-lg font-semibold group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sending Email...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Send size={20} />
                  <span>Send Reset Link</span>
                </div>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <Link 
              to="/login" 
              className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
