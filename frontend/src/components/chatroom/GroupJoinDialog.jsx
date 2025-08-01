import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QrCodeIcon, 
  ClipboardDocumentIcon, 
  UserPlusIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import * as groupApi from '../../API/groupApi';

const GroupJoinDialog = ({ isOpen, onClose, mode = 'join' }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [groupInput, setGroupInput] = useState('');
  const [generatedGroupId, setGeneratedGroupId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  const [error, setError] = useState('');

  // Generate a unique group ID when creating
  const generateGroupId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `GC-${timestamp}-${randomStr}`.toUpperCase();
  };

  // Initialize group ID when component mounts or mode changes to create
  useEffect(() => {
    if (currentMode === 'create' && !generatedGroupId) {
      setGeneratedGroupId(generateGroupId());
    }
  }, [currentMode, generatedGroupId]);

  // Handle creating a new group
  const handleCreateGroup = async () => {
    if (!groupInput.trim()) {
      setError('Please enter a group name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await groupApi.createOrJoinGroup(groupInput.trim(), true);
      
      if (result && result.success) {
        // Update user state
        setUser(prev => ({
          ...prev,
          currentGroupId: result.group.joinCode,
          groupID: result.group.joinCode
        }));

        // Close dialog and navigate to chat
        onClose();
        navigate('/chatroom');
      }
    } catch (error) {
      console.error('Failed to create group:', error);
      setError(error.message || 'Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle joining an existing group
  const handleJoinGroup = async () => {
    if (!groupInput.trim()) {
      setError('Please enter a Group ID');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await groupApi.createOrJoinGroup(groupInput.trim(), false);
      
      if (result && result.success) {
        // Update user state
        setUser(prev => ({
          ...prev,
          currentGroupId: result.group.joinCode,
          groupID: result.group.joinCode
        }));

        // Close dialog and navigate to chat
        onClose();
        navigate('/chatroom');
      }
    } catch (error) {
      console.error('Failed to join group:', error);
      if (error.message && error.message.includes('not found')) {
        setError('Group not found. Please check the Group ID.');
      } else {
        setError(error.message || 'Failed to join group. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Copy group ID to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedGroupId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generatedGroupId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Reset form when mode changes
  const switchMode = (newMode) => {
    setCurrentMode(newMode);
    setGroupInput('');
    setError('');
    if (newMode === 'create' && !generatedGroupId) {
      setGeneratedGroupId(generateGroupId());
    }
  };

  // Close dialog and reset state
  const handleClose = () => {
    setGroupInput('');
    setGeneratedGroupId('');
    setError('');
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-yellow-400/30 w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-amber-400/20 px-6 py-4 border-b border-yellow-400/30">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentMode === 'create' ? 'Create Chat Room' : 'Join Chat Room'}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="p-6">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
            <button
              onClick={() => switchMode('create')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                currentMode === 'create'
                  ? 'bg-yellow-500 text-white shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Create Room
            </button>
            <button
              onClick={() => switchMode('join')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                currentMode === 'join'
                  ? 'bg-yellow-500 text-white shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Join Room
            </button>
          </div>

          {/* Create Mode */}
          {currentMode === 'create' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupInput}
                  onChange={(e) => setGroupInput(e.target.value)}
                  placeholder="Enter a name for your group"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  disabled={isLoading}
                />
              </div>

              {generatedGroupId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Group ID (Share this with others)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={generatedGroupId}
                      readOnly
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        <ClipboardDocumentIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Group ID copied to clipboard!
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Join Mode */}
          {currentMode === 'join' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group ID
                </label>
                <input
                  type="text"
                  value={groupInput}
                  onChange={(e) => setGroupInput(e.target.value)}
                  placeholder="Enter the Group ID (e.g., GC-ABC123-XYZ)"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  disabled={isLoading}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <UserPlusIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      How to join a group
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Ask the group creator for their Group ID and enter it above. 
                      Group IDs look like: GC-ABC123-XYZ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={currentMode === 'create' ? handleCreateGroup : handleJoinGroup}
              disabled={isLoading || !groupInput.trim()}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {currentMode === 'create' ? 'Creating...' : 'Joining...'}
                </div>
              ) : (
                currentMode === 'create' ? 'Create & Join' : 'Join Group'
              )}
            </button>
          </div>

          {/* User Info */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Joining as: <span className="font-medium text-gray-900 dark:text-white">{user?.username || 'Unknown User'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupJoinDialog;
