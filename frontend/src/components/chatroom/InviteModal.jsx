import React, { useState, useEffect } from 'react';
import { 
  LinkIcon, 
  ClipboardDocumentIcon, 
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const InviteModal = ({ isOpen, onClose, group }) => {
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    if (group) {
      // Generate invite link
      const baseUrl = window.location.origin;
      setInviteLink(`${baseUrl}/join/${group.joinCode || group.id}`);
    }
  }, [group]);

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyGroupId = async () => {
    try {
      await navigator.clipboard.writeText(group.joinCode || group.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-yellow-400/30 w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-amber-400/20 px-6 py-4 border-b border-yellow-400/30">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Invite to {group.name}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Group Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <img
              src={group.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
              alt={group.name}
              className="w-10 h-10 rounded-full object-cover border border-yellow-400"
            />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {group.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {group.memberCount || 0} members
              </p>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            {/* Invite Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Share Invite Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                />
                <button
                  onClick={copyInviteLink}
                  className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  title="Copy invite link"
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <LinkIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Group ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Or Share Group ID
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={group.joinCode || group.id}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white font-mono"
                />
                <button
                  onClick={copyGroupId}
                  className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
                  title="Copy Group ID"
                >
                  <ClipboardDocumentIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {copied && (
            <div className="text-sm text-green-600 dark:text-green-400 text-center">
              ✅ Copied to clipboard!
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              How to invite friends:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Share the invite link (they can click to join)</li>
              <li>• Or give them the Group ID to enter manually</li>
              <li>• They'll need the GrindChain app to join</li>
            </ul>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
