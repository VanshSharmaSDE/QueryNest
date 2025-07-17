import { AlertTriangle, X } from 'lucide-react';

const TemporaryChatWarning = ({ isOpen, onClose, onProceed, onEnableHistory }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-yellow-400" size={20} />
            <h3 className="text-lg font-semibold text-white">Temporary Chat Mode</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-3">
            Chat history is currently disabled. Your conversation will be temporary and will disappear when you reload the page or navigate away.
          </p>
          <p className="text-gray-400 text-sm">
            To save your chats permanently, enable chat history in your settings.
          </p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={onEnableHistory}
            className="btn btn-primary w-full"
          >
            Enable Chat History
          </button>
          <button
            onClick={onProceed}
            className="btn btn-secondary w-full"
          >
            Continue with Temporary Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemporaryChatWarning;
