import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, AlertCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    verified: false,
    error: null
  });
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmailAddress = async () => {
      if (!userId || !secret) {
        setVerificationStatus({
          loading: false,
          verified: false,
          error: 'Invalid verification link. Missing required parameters.'
        });
        return;
      }

      try {
        const result = await verifyEmail(userId, secret);
        
        if (result.success && result.verified) {
          setVerificationStatus({
            loading: false,
            verified: true,
            error: null
          });
        } else {
          setVerificationStatus({
            loading: false,
            verified: false,
            error: result.error || 'Failed to verify email. Please try again.'
          });
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus({
          loading: false,
          verified: false,
          error: error.message || 'Failed to verify email. Please try again or contact support.'
        });
      }
    };

    verifyEmailAddress();
  }, [userId, secret, verifyEmail]);

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  if (verificationStatus.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 blur-3xl"></div>
        <div className="relative z-10 w-full max-w-md p-8 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-800 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Verifying Email</h2>
            <p className="text-gray-400">Please wait while we verify your email address...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 blur-3xl"></div>
      <div className="relative z-10 w-full max-w-md p-8 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {verificationStatus.verified ? (
            <>
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <Check className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
              <p className="text-gray-400 mb-8">
                Your email has been successfully verified. You can now access all features of QueryNest.
              </p>
              <button
                onClick={goToDashboard}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Go to Dashboard
              </button>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
              <p className="text-gray-400 mb-8">
                {verificationStatus.error}
              </p>
              <button
                onClick={goToLogin}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Return to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
