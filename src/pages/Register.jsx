import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(formData.email, formData.password, formData.name);
      if (result.success) {
        if (result.verificationSent) {
          setVerificationSent(true);
          toast.success(result.message || 'Please check your email to verify your account');
        } else {
          setVerificationError(result.message || 'Account created but verification email could not be sent.');
          toast.error(result.message || 'Verification email failed to send');
        }
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Failed to create account. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const goToLogin = () => {
    toast.success('Account created! Please check your email to verify your account.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 blur-3xl"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {verificationSent ? (
        <div className="relative z-10 w-full max-w-md p-8 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
              <Mail className="h-10 w-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Verification Email Sent</h2>
            <p className="text-gray-400 mb-4">
              We've sent a verification link to <span className="text-blue-400 font-medium">{formData.email}</span>
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Please check your email and click the verification link to activate your account.
              {verificationError && (
                <span className="block mt-4 text-yellow-500">
                  Note: {verificationError}
                </span>
              )}
            </p>
            
            <div className="w-full p-4 bg-gray-800/50 rounded-lg mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-2">What happens next?</h3>
              <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the verification link in the email</li>
                <li>Once verified, you can log in to your account</li>
              </ol>
            </div>
            
            <button
              onClick={() => window.location.href = `mailto:${formData.email}`}
              className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg font-medium transition-colors duration-200 mb-4"
            >
              Open Email App
            </button>
            
            <button
              onClick={goToLogin}
              className="w-full py-3 mt-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Go to Login
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
        </div>
      ) : (
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
              Create Your <span className="text-gradient">Account</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Join thousands of users leveraging AI for smarter insights
            </p>
          </div>

          {/* Registration Form */}
          <div className="card backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input pl-12 w-full h-14 text-lg"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

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
                    value={formData.email}
                    onChange={handleChange}
                    className="input pl-12 w-full h-14 text-lg"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input pl-12 pr-12 w-full h-14 text-lg"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input pl-12 pr-12 w-full h-14 text-lg"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-6 w-6 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200 text-lg disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-blue-500/25 group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Create Account</span>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Terms */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-blue-400 hover:text-blue-300 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
